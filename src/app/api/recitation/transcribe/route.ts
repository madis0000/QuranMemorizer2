import { NextResponse } from "next/server";

import { apiError, handleApiError } from "@/lib/api/errors";
import { withAuth } from "@/lib/api/with-auth";
import { logger } from "@/lib/logger";

const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * POST /api/recitation/transcribe
 * Transcribe Arabic audio using the Whisper model.
 * Proxies to HuggingFace Inference API with tarteel-ai/whisper-base-ar-quran.
 */
export const POST = withAuth(
  async (request, { userId }) => {
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof Blob)) {
      return apiError("VALIDATION_ERROR", "No audio file provided");
    }

    // Enforce file size limit
    if (audioFile.size > MAX_AUDIO_SIZE) {
      return apiError(
        "PAYLOAD_TOO_LARGE",
        `Audio file exceeds ${MAX_AUDIO_SIZE / 1024 / 1024}MB limit`
      );
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return apiError(
        "SERVICE_UNAVAILABLE",
        "Transcription service not configured"
      );
    }

    // Send to HuggingFace Inference API
    const arrayBuffer = await audioFile.arrayBuffer();
    const response = await fetch(
      "https://api-inference.huggingface.co/models/tarteel-ai/whisper-base-ar-quran",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "audio/webm",
        },
        body: arrayBuffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(
        { userId, status: response.status, errorText },
        "HuggingFace API error"
      );

      if (response.status === 503) {
        return apiError(
          "SERVICE_UNAVAILABLE",
          "Model is loading, please try again in a few seconds"
        );
      }

      return apiError("INTERNAL_ERROR", "Transcription failed");
    }

    const result = await response.json();

    return NextResponse.json({
      text: result.text || "",
      confidence: result.confidence ?? 0.8,
      segments: result.chunks ?? [],
    });
  },
  { maxRequests: 20, windowSeconds: 60 }
);
