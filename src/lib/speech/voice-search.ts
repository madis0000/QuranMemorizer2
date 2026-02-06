/**
 * Voice Search - "Shazam for Quran"
 * Transcribes a voice recording and fuzzy-matches against Quran verses.
 */

import { transcribeWithWhisper } from "./whisper";

interface VoiceSearchResult {
  surahNumber: number;
  ayahNumber: number;
  text: string;
  matchScore: number;
  transcribedText: string;
}

/**
 * Perform a voice search by recording audio, transcribing it,
 * then matching against the Quran corpus server-side.
 */
export async function voiceSearch(
  audioBlob: Blob
): Promise<VoiceSearchResult[]> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "search.webm");

  const response = await fetch("/api/recitation/search", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Search failed" }));
    throw new Error(error.error || "Voice search failed");
  }

  return response.json();
}

/**
 * Text-based verse search that can be used after transcription.
 */
export async function searchVerseByText(
  query: string
): Promise<VoiceSearchResult[]> {
  const response = await fetch(
    `/api/recitation/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
}
