Activate **Team Voice AI** agent context for speech recognition, Whisper fallback, voice search, and fluency metrics.

You are now **Team Voice AI**. Your mission is to build the most accurate Arabic Quran recitation recognition system in any web app.

## Priority 1: Fix Whisper Auto-Fallback

Current issue: `src/lib/speech/recognition.ts` always uses Web Speech API. The `shouldUseWhisper()` function in `src/lib/speech/whisper.ts` exists but is never called.

**Fix**: In `src/components/voice/VoiceRecorder.tsx` and `src/hooks/use-voice-recognition.ts`:

1. Check `shouldUseWhisper()` on initialization
2. If true (Firefox, Safari, or ar-SA not supported), automatically use Whisper API
3. If Web Speech API fails 3 times consecutively, fallback to Whisper
4. Show user indicator of which recognition engine is active

## Priority 2: Voice Search "Shazam for Quran" (Port from V1)

V1 has a fully working voice verse detector (`components/VoiceVerseDetector.tsx`):

- Floating action button opens voice search modal
- Real-time debounced search (300ms) as user speaks
- Shows low-confidence partial matches while listening
- Auto-navigates when confidence >= 75%
- Dual search: local PostgreSQL first, quran.com API fallback
- Fuzzy matching via Levenshtein on normalized Arabic text

**Port into V2**:

- Wire `src/app/(main)/search/page.tsx` to actual search (currently hardcoded)
- Use existing `src/lib/speech/voice-search.ts` + `src/app/api/recitation/search/route.ts`
- Add floating "Shazam" button accessible from any page
- Real-time confidence display during listening

## Priority 3: Enhanced Recitation Tracking

Current: `src/components/voice/RecitationTracker.tsx` shows interim/final transcript.

Enhance with:

- Word-by-word tracking states: pending, current, correct, incorrect, skipped
- Visual highlighting as each word is recognized
- Three strictness levels from V1: lenient (65%), medium (80%), strict (95%)
- Auto-advance to next verse when current verse complete
- Auto-restart microphone for continuous practice
- Duplicate word disambiguation with numbered badges (from V1)
- Stuck word detection with popup modal (from V1)

## Priority 4: Fluency Metrics

New feature - track recitation quality over time:

```typescript
interface FluencyMetrics {
  wordsPerMinute: number; // Speed tracking
  pauseCount: number; // Number of hesitations
  averagePauseDuration: number; // ms between words
  longestPause: number; // Longest hesitation
  confidenceScore: number; // 0-100 based on speech API confidence
  retryCount: number; // How many times user re-started
  fluencyScore: number; // Composite 0-100
}
```

- Track WPM over sessions to show improvement
- Detect hesitation patterns (which words cause pauses?)
- Generate personalized recommendations ("You tend to hesitate on verse X")
- Session-over-session improvement graphs

**Files to create**:

- `src/lib/speech/fluency.ts` - Fluency calculation engine
- `src/components/voice/FluencyDisplay.tsx` - Real-time fluency indicators
- `src/components/voice/FluencyHistory.tsx` - Historical fluency charts

## Priority 5: Recitation Replay with Diff

Record practice sessions and replay with visual annotations:

- Use existing `src/lib/audio/recorder.ts` to capture user audio
- Store recordings in IndexedDB (audio blobs)
- Replay with synchronized word highlighting (green=correct, red=mistake)
- Timeline overlay showing Tajweed rule accuracy
- Option to compare user audio with Qari reference audio
- Share recordings with teacher/study partner

**Files to create**:

- `src/lib/speech/replay.ts` - Recording storage + playback logic
- `src/components/voice/RecitationReplay.tsx` - Annotated playback UI
- `src/components/voice/WaveformComparison.tsx` - User vs Qari waveform

## Key Existing Files

- `src/lib/speech/recognition.ts` (319 lines) - ArabicSpeechRecognizer class
- `src/lib/speech/whisper.ts` (89 lines) - HuggingFace Whisper client
- `src/lib/speech/voice-search.ts` (56 lines) - Search by audio/text
- `src/components/voice/VoiceRecorder.tsx` (254 lines) - Mic button + volume viz
- `src/components/voice/RecitationTracker.tsx` - Transcript display
- `src/hooks/use-voice-recognition.ts` (103 lines) - Transcript accumulation + compare
- `src/lib/audio/recorder.ts` (253 lines) - AudioRecorder class
- `src/app/api/recitation/transcribe/route.ts` - Whisper proxy
- `src/app/api/recitation/search/route.ts` - Voice search API

## V1 Patterns to Port

From V1's `components/PracticeMode.tsx`:

- Word-by-word tracking with visual states: pending, correct, incorrect, current
- `maxAlternatives: 3` for multiple recognition candidates
- Stuck word detection with popup modal
- Auto-advance to next verse + auto-restart microphone
- Success/error sounds via Web Audio API oscillators
- Keyboard shortcuts for voice control

From V1's `components/VoiceVerseDetector.tsx`:

- Floating action button pattern
- Real-time debounced search
- Low-confidence partial match display
- Auto-navigation on high confidence

## Bug Fix: Missing Surah/Ayah Context

In `src/hooks/use-voice-recognition.ts` lines 58-59, mistakes are recorded with `surahNumber: 0, ayahNumber: 0`. The calling code must pass actual surah/ayah from the session store.

## Guidelines

- Web Speech API is unreliable — always have Whisper as fallback
- Arabic speech recognition works best with `lang: 'ar-SA'` and `continuous: true`
- Use `interimResults: true` for real-time tracking feel
- Audio recording uses MediaRecorder with `audio/webm;codecs=opus` for small file sizes
- Store recordings in IndexedDB, not server (privacy + size)
- Fluency metrics should be computed client-side for real-time display
- Ensure voice features work in both Chrome (Web Speech) and Firefox (Whisper)

Work on the task described in $ARGUMENTS.
