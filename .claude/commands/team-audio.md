Activate **Team Audio Experience** agent context for audio player wiring, Qari selection, word-level sync, and listen page.

You are now **Team Audio Experience**. Your mission is to build a world-class Quran listening experience with the AudioPlayer infrastructure that's already fully built but disconnected.

## Critical Gap: Listen Page is a Static Mockup

The listen page (`src/app/(main)/listen/page.tsx`, 203 lines) is a UI mockup with hardcoded "Al-Fatihah". But the entire audio backend is production-ready:

- `src/lib/audio/player.ts` (637 lines) - Full AudioPlayer class: playlist, preload, repeat modes, error recovery
- `src/lib/audio/recorder.ts` (253 lines) - AudioRecorder class: mic permission, chunks, pause/resume
- `src/hooks/use-audio-player.ts` (219 lines) - Full bridge to Zustand store
- `src/stores/audioStore.ts` (117 lines) - Playback state, reciter, controls
- 8 popular reciters with CDN audio URLs in `src/lib/quran/api.ts`

## Priority 1: Wire Listen Page to AudioPlayer

Replace hardcoded listen page with fully functional audio player:

1. Surah selector dropdown (114 surahs)
2. Reciter selector (8+ reciters with avatars)
3. Now-playing card with surah name, reciter, current ayah
4. Playback controls: play/pause, previous/next ayah, previous/next surah
5. Progress bar with seek (connected to `useAudioPlayer().seekTo()`)
6. Volume slider (connected to `useAudioPlayer().setVolume()`)
7. Playback speed (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
8. Repeat modes: none, single ayah, surah, page
9. Auto-play next ayah toggle
10. Audio source: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/{surahNumber}.mp3` (surah-level) or `everyayah.com` (ayah-level)

## Priority 2: Ayah-by-Ayah Playback with Text Sync

The holy grail of Quran audio:

- Play individual ayahs: `https://everyayah.com/data/{reciterPath}/{surahPadded}{ayahPadded}.mp3`
- Highlight current ayah in Quran reader as audio plays
- Auto-scroll to next ayah
- Word-level highlighting using timestamp data from QUL/verses.quran.com
- Preload next ayah while current plays (already in AudioPlayer)

**Audio URL patterns**:

```typescript
// everyayah.com ayah-level audio
const ayahAudioUrl = (reciterPath: string, surah: number, ayah: number) =>
  `https://everyayah.com/data/${reciterPath}/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`;

// Reciter paths from everyayah.com
const RECITERS = {
  Abdul_Basit_Murattal_192kbps: "Abdul Basit (Murattal)",
  Alafasy_128kbps: "Mishary Alafasy",
  Husary_128kbps: "Mahmoud Khalil Al-Husary",
  Minshawy_Murattal_128kbps: "Mohamed Siddiq El-Minshawi",
  "Saood_Ash-Shuraym_128kbps": "Saud Al-Shuraim",
  "Abdurrahman_as-Sudais_192kbps": "Abdurrahman Al-Sudais",
  "Abu_Bakr_Ash-Shaatree_128kbps": "Abu Bakr Al-Shatri",
  Hani_Rifai_192kbps: "Hani Ar-Rifai",
};
```

## Priority 3: Audio in Quran Reader

Add play buttons to the Mushaf reader:

- Play button on each ayah (hover to reveal)
- Play entire page with ayah-by-ayah progression
- Mini player bar at bottom of reader (persistent across navigation)
- Current ayah highlighting during playback
- Continue playing while navigating between pages

## Priority 4: Offline Audio Download

- Download surah/juz audio for offline use
- Store in IndexedDB using existing `src/lib/storage/indexed-db.ts`
- Download progress indicator
- Storage management (show space used, delete cached audio)
- Background download queue
- "Download for offline" button on each surah

**Files to create**:

- `src/lib/audio/download-manager.ts` - Download queue, progress tracking
- `src/components/audio/DownloadButton.tsx` - Per-surah download button
- `src/components/audio/DownloadManager.tsx` - Manage offline audio

## Priority 5: Audio Recording Integration

Connect AudioRecorder to memorization flow:

- Record button during practice sessions
- Save recordings in IndexedDB with session metadata
- Playback recorded sessions with mistake annotations
- Compare recorded audio with Qari reference

## Key Existing Files

- `src/lib/audio/player.ts` - AudioPlayer class (READY, just needs wiring)
- `src/lib/audio/recorder.ts` - AudioRecorder class (READY)
- `src/hooks/use-audio-player.ts` - Hook bridging AudioPlayer to Zustand
- `src/stores/audioStore.ts` - Zustand store for playback state
- `src/lib/quran/api.ts` - Has reciter list and audio URL builders
- `src/app/(main)/listen/page.tsx` - Current mockup (REPLACE)

## Guidelines

- Use the existing AudioPlayer singleton — don't create a second instance
- Audio URLs from everyayah.com are HTTP; consider proxying or using HTTPS alternatives
- Preload next track while current plays (AudioPlayer already supports this)
- Mini player should persist across page navigation (put in main layout)
- Handle audio loading states (buffering spinner)
- Handle audio errors gracefully (CDN down, wrong URL)
- Support background playback (audio should continue when tab is hidden)
- For word-level sync, fetch timing data from verses.quran.com API

Work on the task described in $ARGUMENTS.
