Activate **Team Tajweed** agent context for porting V1's 6-layer Tajweed system and building the Tajweed mastery path.

You are now **Team Tajweed**. Your mission is to bring the comprehensive Tajweed system from V1 (github.com/madis0000/QuranMemorizer) into V2, enhanced with a full learning path and mastery tracking.

## What to Port from V1

The V1 repo has a battle-tested 6-layer Tajweed system. Study these V1 files for algorithms and approaches:

### Layer 1: Text-Based Detection (`lib/tajweedDetector.ts` in V1)

- `TajweedDetector` class: character-by-character Arabic text analysis
- Detects: Qalqalah (letters + Sukun), Noon Sakinah/Tanween rules (Ikhfa, Iqlab, Idgham with/without Ghunna), Lam Shamsiyah
- `getNextLetter()` skips diacritics to find next meaningful letter
- 1000-entry memoization cache for performance

### Layer 2: API-Based Rule Mapping (`lib/tajweedRuleDetector.ts` in V1)

- Parses `<tajweed class="...">` HTML from Quran Foundation API
- Maps 30+ CSS class variants (handles spelling: `ikhfa`/`ikhafa`, `madda`/`madd`, `qalaqala`/`qalqalah`)
- Each rule: type, name, Arabic name, description, expected duration (ms), color, visual type
- Priority: Madd > Qalqalah > Ikhfa > Idgham > Iqlab > Ghunnah > Sukun
- Client-side Qalqalah fallback when API markup missing

### Layer 3: HTML Word Segmentation (`lib/tajweedHtmlUtils.ts` in V1)

- Split Tajweed-marked HTML into individual words preserving markup
- Character-by-character HTML-to-plain-text index mapping
- Balance unclosed HTML tags
- `renderTajweedWordWithMemoryMode()`: Tajweed colors + Memory Challenge hiding

### Layer 4: Real-Time Audio Analysis (`lib/audioAnalysis.ts` in V1)

- `TajweedAudioAnalyzer` using Web Audio API `AnalyserNode` with 2048-point FFT
- Extracts: duration, volume (RMS), pitch (peak freq bin), nasality (200-500Hz energy), clarity (peak/avg), intensity, smoothness (volume variance)
- Rule-specific weighted scoring:
  - Madd: Duration 35%, Smoothness 30%, Volume 25%
  - Qalqalah: Intensity 50%, Duration 30%, Non-nasal 20%
  - Ikhfa: Nasality 60%, Intensity 25%, Duration 15%
  - Idgham: Smoothness 40%, Clarity 30%, Volume 20%
  - Ghunnah: Nasality 60%, Duration 30%, Volume 10%
- Gaussian scoring curves for duration tolerances

### Layer 5: Coaching Panel (`components/TajweedAssistant.tsx` in V1)

- Fixed panel: current rule Arabic name, description, expected Madd counts
- Animated circular progress for Madd timing
- Listening status indicator
- Queued toast notifications for per-word accuracy feedback (5s auto-dismiss)

### Layer 6: Animated Visuals (`components/tajweed-visuals/` in V1)

- 6 components: MaddVisual, QalqalahVisual, IkhfaVisual, IdghamVisual, IqlabVisual, GhunnahVisual

## V2 Key Files (Existing)

- `src/types/quran.ts` - Has TAJWEED_COLORS constant (13 colors) and TajweedRule interface
- `src/components/quran/MushafWord.tsx` - Needs Tajweed color rendering (currently no-op)
- `src/stores/quranStore.ts` - Has showTajweed toggle
- `src/app/(main)/quran/page.tsx` - Quran reader page

## V2 Files to Create

- `src/lib/tajweed/detector.ts` - Port Layer 1
- `src/lib/tajweed/rule-mapper.ts` - Port Layer 2
- `src/lib/tajweed/html-utils.ts` - Port Layer 3
- `src/lib/tajweed/audio-analyzer.ts` - Port Layer 4
- `src/components/tajweed/TajweedCoach.tsx` - Port + enhance Layer 5
- `src/components/tajweed/visuals/` - Port Layer 6 (6 visual components)
- `src/components/tajweed/TajweedPractice.tsx` - Rule-specific practice mode
- `src/components/tajweed/TajweedMasteryPath.tsx` - Learning path UI
- `src/components/tajweed/TajweedRuleCard.tsx` - Individual rule display
- `src/stores/tajweedStore.ts` - Active rules, coaching state, mastery levels
- `src/app/(main)/tajweed/page.tsx` - Tajweed learning path page
- `src/app/api/tajweed/rules/route.ts` - Rules API
- `src/app/api/tajweed/analyze/route.ts` - Audio analysis API
- `src/app/api/tajweed/progress/route.ts` - Mastery tracking API

## Tajweed Color Scheme

| Rule               | Color   | Hex       |
| ------------------ | ------- | --------- |
| Qalqalah           | Blue    | `#0088ff` |
| Ikhfa              | Green   | `#169777` |
| Iqlab              | Orange  | `#ff7e1e` |
| Idgham (Ghunna)    | Magenta | `#d500b7` |
| Idgham (No Ghunna) | Gray    | `#aaaaaa` |
| Ghunna             | Pink    | `#ff69b4` |
| Madd Normal        | Magenta | `#d500b7` |
| Madd Obligatory    | Red     | `#ff0000` |
| Lam Shamsiyah      | Gray    | `#aaaaaa` |

## Tajweed Mastery Path (NEW Feature)

Progressive unlocking system for learning Tajweed rules:

1. **Noon Sakinah & Tanween** (Ikhfa, Iqlab, Idgham, Izhar)
2. **Meem Sakinah** (Ikhfa Shafawi, Idgham Shafawi, Izhar Shafawi)
3. **Qalqalah** (Minor and Major)
4. **Madd** (Natural, Connected, Separated, Necessary, Permissible)
5. **Lam Rules** (Shamsiyah, Qamariyah)
6. **Advanced** (Tafkheem, Tarqeeq, Sifaat)

Each rule has mastery levels: NONE → BRONZE (70%/3 sessions) → SILVER (80%/5) → GOLD (90%/7) → PLATINUM (95%/10) → MASTER (98%/15)

## Guidelines

- When porting from V1, adapt to V2 patterns (React Query, Zustand, proper module structure)
- Decompose V1's monolithic components into smaller, focused V2 components
- Ensure Tajweed colors render on MushafWord component when showTajweed is enabled
- Audio analysis should work alongside the existing VoiceRecorder component
- Use `"use client"` only for components that need browser APIs (audio, speech)
- All Tajweed data should be cacheable in IndexedDB for offline use

Work on the task described in $ARGUMENTS.
