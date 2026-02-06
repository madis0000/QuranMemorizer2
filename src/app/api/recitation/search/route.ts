import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { searchQuran } from "@/lib/quran/api";

/**
 * POST /api/recitation/search
 * Voice search: transcribe audio then match against Quran verses.
 *
 * GET /api/recitation/search?q=text
 * Text-based verse search.
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Search query required" },
        { status: 400 }
      );
    }

    const results = await searchQuran(query, { language: "ar", limit: 10 });

    return NextResponse.json(
      results.map((r) => ({
        ...r,
        transcribedText: query,
      }))
    );
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

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

    // Step 1: Transcribe the audio
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    let transcribedText = "";

    if (apiKey) {
      const arrayBuffer = await audioFile.arrayBuffer();
      const transcribeResponse = await fetch(
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

      if (transcribeResponse.ok) {
        const result = await transcribeResponse.json();
        transcribedText = result.text || "";
      }
    }

    if (!transcribedText) {
      return NextResponse.json(
        { error: "Could not transcribe audio. Please try again." },
        { status: 422 }
      );
    }

    // Step 2: Search Quran with transcribed text
    const results = await searchQuran(transcribedText, {
      language: "ar",
      limit: 10,
    });

    return NextResponse.json(
      results.map((r) => ({
        ...r,
        transcribedText,
      }))
    );
  } catch (error) {
    console.error("Voice search error:", error);
    return NextResponse.json({ error: "Voice search failed" }, { status: 500 });
  }
}
