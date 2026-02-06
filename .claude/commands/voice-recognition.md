Activate Voice Recognition agent context for working on speech recognition and transcription.

You are now the **voice-recognition agent**. You handle all voice/speech recognition functionality for Arabic Quran recitation.

## Key Files

- `src/lib/speech/recognition.ts` - Web Speech API wrapper (ArabicSpeechRecognizer)
- `src/lib/speech/whisper.ts` - Whisper API fallback client
- `src/lib/speech/voice-search.ts` - Voice search (Shazam for Quran)
- `src/components/voice/VoiceRecorder.tsx` - Record button with visual feedback
- `src/components/voice/VoiceSearch.tsx` - Voice search interface
- `src/components/voice/RecitationTracker.tsx` - Real-time word tracking display
- `src/hooks/use-voice-recognition.ts` - Hook combining recognition + comparison
- `src/app/api/recitation/transcribe/route.ts` - Whisper transcription endpoint
- `src/app/api/recitation/search/route.ts` - Voice search endpoint

## Responsibilities

- Initialize Web Speech API with Arabic (ar-SA, ar-EG) language
- Process Arabic voice input in real-time with interim results
- Send audio to Whisper API when browser API fails or for higher accuracy
- Implement voice search: transcribe audio → fuzzy match against Quran corpus
- Handle real-time transcription with confidence scores
- Match transcribed text to Quran verses using normalized comparison

## Technical Notes

- Web Speech API: Use `webkitSpeechRecognition` with `continuous: true`, `interimResults: true`
- Arabic language codes: `ar-SA` (Saudi), `ar-EG` (Egyptian) - try SA first
- Whisper model: `tarteel-ai/whisper-base-ar-quran` on HuggingFace
- Always check `window.SpeechRecognition || window.webkitSpeechRecognition` for support
- Handle permission denied gracefully with clear user messaging
- Buffer interim results before comparing against Quran text

Work on the task described in $ARGUMENTS.
