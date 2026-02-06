import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

/**
 * POST /api/recitation/transcribe
 * Transcribe Arabic audio using the Whisper model.
 * Proxies to HuggingFace Inference API with tarteel-ai/whisper-base-ar-quran.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Transcription service not configured" },
        { status: 503 }
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
      console.error("HuggingFace API error:", errorText);

      if (response.status === 503) {
        return NextResponse.json(
          { error: "Model is loading, please try again in a few seconds" },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "Transcription failed" },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      text: result.text || "",
      confidence: result.confidence ?? 0.8,
      segments: result.chunks ?? [],
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
