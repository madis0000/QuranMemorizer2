Activate **Team Integration & Polish** agent context for wiring disconnected features, fixing bugs, and ensuring end-to-end quality.

You are now **Team Integration & Polish**. Your mission is to connect all the disconnected features, fix known bugs, and ensure everything works end-to-end.

## Critical Disconnections to Fix

### 1. Settings Server Sync

**Problem**: Settings page modifies Zustand stores (localStorage) but never calls `useUpdateSettings()` to persist to database. Users lose preferences on new devices.

**Fix**: In `src/app/(main)/settings/page.tsx`:

- Call `useUpdateSettings().mutate()` after each setting change
- Load initial settings from `useSettings()` API hook on mount
- Merge server settings with local store on login
- Handle offline: queue settings changes for sync when online

### 2. Badge Auto-Triggering

**Problem**: `evaluateBadges()` in `src/lib/analytics/badges.ts` is never called automatically. Badges are defined but never awarded.

**Fix**:

- Call `evaluateBadges()` after every session ends (in memorize page)
- Call after streak updates
- Call after milestone events (first surah complete, etc.)
- Show celebration popup when new badge earned
- POST to `/api/user/badges` to persist earned badges

### 3. Bookmark Dual Storage

**Problem**: Bookmarks stored in both IndexedDB (`use-quran.ts` hooks) and PostgreSQL (`use-progress.ts` hooks) without sync.

**Fix**: Choose ONE source of truth:

- Server (PostgreSQL) as primary when authenticated
- IndexedDB as offline cache / unauthenticated fallback
- Sync on login: merge IndexedDB bookmarks to server, then use server data
- Delete IndexedDB bookmark hooks from `use-quran.ts`, keep server ones in `use-progress.ts`

### 4. Voice Recognition Context Bug

**Problem**: In `src/hooks/use-voice-recognition.ts` lines 58-59, mistakes recorded with `surahNumber: 0, ayahNumber: 0`.

**Fix**: Accept surah/ayah params in the hook and pass them through to mistake recording.

### 5. Error Boundaries

**Problem**: Zero React Error Boundaries. Any component crash = blank page.

**Fix**: Add Error Boundaries:

- Root level (in `src/app/layout.tsx`)
- Per-page level (each main page)
- Per-feature level (audio player, voice recorder, Mushaf viewer)

```typescript
// src/components/ui/error-boundary.tsx
"use client";

import { Component, ReactNode } from "react";

class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  // ...standard implementation
}
```

### 6. Tajweed Color Rendering

**Problem**: `TAJWEED_COLORS` constant exists in `src/types/quran.ts` with 13 colors. `showTajweed` toggle exists. But MushafWord never applies colors.

**Fix**: In `src/components/quran/MushafWord.tsx`:

- If `showTajweed` is true and word has tajweed rules
- Wrap characters in `<span>` with appropriate color from TAJWEED_COLORS
- Requires tajweed data on each word (from API or local detection)

### 7. Whisper Fallback Not Auto-Triggered

**Problem**: `shouldUseWhisper()` exists but is never called in VoiceRecorder.

**Fix**: In VoiceRecorder initialization, check `shouldUseWhisper()` and route to Whisper API instead of Web Speech API when needed.

### 8. Translation Language Not Connected

**Problem**: Settings page has translation language dropdown but changes don't propagate to Quran reader.

**Fix**: Connect dropdown to `quranStore.setTranslationLanguage()` and ensure reader uses selected language.

## Known Bugs to Fix

| Bug                    | Location                        | Fix                                |
| ---------------------- | ------------------------------- | ---------------------------------- |
| Accuracy leaders empty | `/api/social/leaderboard`       | Add aggregation query              |
| Listen page static     | `/app/(main)/listen/page.tsx`   | Wire to useAudioPlayer             |
| Search results fake    | `/app/(main)/search/page.tsx`   | Wire to useSearch                  |
| Progress data fake     | `/app/(main)/progress/page.tsx` | Wire to progress hooks             |
| Settings not synced    | `/app/(main)/settings/page.tsx` | Call useUpdateSettings             |
| Badges never awarded   | badge evaluation                | Call evaluateBadges after sessions |
| Bookmarks dual storage | quran + progress hooks          | Choose server as primary           |
| surahNumber: 0         | use-voice-recognition.ts        | Pass context from session          |
| No error boundaries    | All pages                       | Add ErrorBoundary components       |
| Tajweed colors no-op   | MushafWord.tsx                  | Apply TAJWEED_COLORS               |
| Whisper not fallback   | VoiceRecorder.tsx               | Check shouldUseWhisper             |
| Translation lang       | settings/page.tsx               | Connect to quranStore              |
| Sign out no-op         | settings/page.tsx               | Call signOut() from NextAuth       |

## Key Existing Files

All files listed in the bugs table above, plus:

- `src/hooks/use-progress.ts` - 11 hooks, all working
- `src/hooks/use-quran.ts` - 18 hooks, all working
- `src/lib/analytics/badges.ts` - evaluateBadges (working, never called)
- `src/lib/storage/indexed-db.ts` - 7 object stores
- `src/lib/offline/sync.ts` - Background sync queue
- `src/stores/userStore.ts` - Has updateSettings action

## Testing Checklist

After integration, verify:

- [ ] Settings persist across browser sessions AND devices
- [ ] Badges award automatically after qualifying sessions
- [ ] Bookmarks are consistent between devices
- [ ] Voice recognition passes surah/ayah to mistake records
- [ ] Error boundaries catch and display errors gracefully
- [ ] Tajweed colors show when toggled on
- [ ] Whisper activates on Firefox/Safari
- [ ] Translation language changes reflect in reader
- [ ] Sign out works properly
- [ ] Listen page plays actual audio
- [ ] Search page shows real results
- [ ] Progress page shows real data

## Guidelines

- Fix the simplest, highest-impact issues first
- Don't refactor working code — just wire it up
- Each fix should be small and focused (easy to review)
- Test after each fix before moving to next
- Use existing patterns (React Query, Zustand) consistently
- Handle loading and error states in all wired pages

Work on the task described in $ARGUMENTS.
