# QuranMemorizer 2.0 - Project Context

## Project Overview

A comprehensive Quran memorization web application inspired by Tarteel.ai, featuring AI-powered voice recognition for Arabic Quran recitation, real-time mistake detection, and gamified learning experiences.

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand for global state, React Query for server state
- **Audio Processing**: Web Audio API, MediaRecorder API
- **Speech Recognition**: Web Speech API (browser) + Whisper API fallback
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Quran Data**: AlQuran.cloud API, QUL (Quranic Universal Library)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main app routes
│   │   ├── quran/         # Quran reader
│   │   ├── memorize/      # Memorization mode
│   │   ├── listen/        # Listening mode
│   │   ├── search/        # Voice & text search
│   │   ├── progress/      # Analytics & progress
│   │   └── settings/      # User settings
│   └── api/               # API routes
├── components/
│   ├── ui/                # Base UI components (shadcn)
│   ├── quran/             # Quran-specific components
│   │   ├── MushafPage/    # Page-accurate Mushaf rendering
│   │   ├── MushafLine/    # Single line with justification
│   │   ├── MushafWord/    # Word with Tajweed colors
│   │   ├── AyahDisplay/   # Verse display (adaptive mode)
│   │   ├── SurahSelector/ # Surah navigation
│   │   ├── EditionSelector/ # Mushaf edition picker
│   │   └── AudioPlayer/   # Recitation player
│   ├── memorization/      # Memorization components
│   │   ├── HiddenVerse/   # Hidden verse mode
│   │   ├── MistakeHighlight/
│   │   └── ProgressiveReveal/
│   ├── voice/             # Voice recognition components
│   │   ├── VoiceRecorder/
│   │   ├── VoiceSearch/
│   │   └── RecitationTracker/
│   └── gamification/      # Gamification components
│       ├── StreakDisplay/
│       ├── BadgeSystem/
│       └── Leaderboard/
├── data/                   # Static Quran data
│   └── mushaf-layouts/    # Layout databases from QUL
│       ├── madinah-1405h.json
│       ├── madinah-1421h.json
│       ├── madinah-1441h.json
│       ├── indopak-15-lines.json
│       ├── indopak-13-lines.json
│       └── words.json     # Word database
├── lib/
│   ├── quran/             # Quran data utilities
│   │   ├── api.ts         # API fetching
│   │   ├── mushafRenderer.ts # Page rendering logic
│   │   └── layoutParser.ts # Parse layout databases
│   ├── speech/            # Speech recognition utilities
│   ├── audio/             # Audio processing utilities
│   └── analytics/         # Progress tracking utilities
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript types
├── fonts/                 # Arabic fonts
│   ├── KFGQPC/           # King Fahd fonts
│   ├── Amiri/            # Amiri Arabic font
│   └── IndoPak/          # Nastaleeq fonts
└── utils/                 # Utility functions
```

## Core Features to Implement

### 1. Quran Reading Experience

- **Page-Accurate Mushaf Rendering** (CRITICAL for memorization)
  - Madinah 1405H (KFGQPC V1) - 604 pages, 15 lines
  - Madinah 1421H (KFGQPC V2) - 604 pages, 15 lines
  - Madinah 1441H (KFGQPC V4) - 604 pages, 15 lines
  - IndoPak 15 lines (Qudratullah) - 610 pages
  - IndoPak 13 lines (Taj company) - 849 pages
  - IndoPak 16 lines - 548 pages
  - Digital Khatt edition
- Exact page/line/word positioning matching physical Mushaf
- Tajweed color coding toggle
- Adaptive mode for responsive reading
- Dark/Light/Sepia themes
- Translation display (112+ languages)
- Tafsir integration
- Word-by-word translation with tooltips
- Transliteration support
- Bookmarks and notes

### 2. Voice Recognition & Recitation

- Real-time recitation follow-along
- Word-by-word tracking as user recites
- Voice search ("Shazam for Quran")
- Arabic speech-to-text conversion
- Support for different recitation styles

### 3. Memorization Mode

- Hidden verses mode
- Progressive verse revealing
- Peeking feature (tap to reveal)
- Word-level mistake detection
- Skipped word detection
- Tashkeel (diacritical) error flagging
- Live correction (recited vs correct comparison)
- Session recording and playback

### 4. Listening Mode

- Multiple Qari selections
- Ayah-by-ayah playback
- Surah playback
- Background listening
- Playback speed control
- Loop/repeat functionality
- Offline audio download

### 5. Progress & Analytics

- Smart goals (daily, weekly, custom)
- Streak tracking with heatmaps
- Surah strength assessment
- Historical mistakes log
- Session history
- Memorization progress tracker
- Custom reports and insights

### 6. Gamification

- Achievement badges
- Daily streaks
- Challenges and milestones
- Leaderboards
- Groups/community features

### 7. Settings & Personalization

- Multiple Mushaf scripts
- Theme customization
- Notification preferences
- Language settings
- Audio preferences
- Goal settings

## API Endpoints Structure

```
/api/
├── auth/                  # Authentication
├── quran/
│   ├── surah/            # Surah data
│   ├── ayah/             # Ayah data
│   ├── search/           # Text search
│   └── audio/            # Audio URLs
├── recitation/
│   ├── transcribe/       # Voice to text
│   ├── compare/          # Compare recitation
│   └── mistakes/         # Mistake detection
├── progress/
│   ├── sessions/         # Session tracking
│   ├── goals/            # Goal management
│   └── streaks/          # Streak tracking
├── user/
│   ├── settings/         # User preferences
│   ├── bookmarks/        # Saved bookmarks
│   └── badges/           # Achievements
└── social/
    ├── groups/           # Group features
    └── leaderboard/      # Rankings
```

## External APIs & Resources

- **AlQuran.cloud API**: https://alquran.cloud/api
- **QUL (Quranic Universal Library)**: https://qul.tarteel.ai/
  - Mushaf Layouts: https://qul.tarteel.ai/mushaf_layouts (29 editions)
  - Layout Resources: https://qul.tarteel.ai/resources/mushaf-layout
  - API Docs: https://qul.tarteel.ai/docs/mushaf-layout
- **Whisper Arabic Quran Model**: tarteel-ai/whisper-base-ar-quran on HuggingFace
- **Quran Audio Sources**:
  - everyayah.com - Multiple Qari recitations
  - verses.quran.com - Word-level audio
  - QUL segmented audio (62 reciters with timestamps)
- **Fonts**:
  - KFGQPC Hafs fonts (Uthmani)
  - Amiri Quran font
  - IndoPak Nastaleeq fonts

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run db:push      # Push Prisma schema
npm run db:studio    # Open Prisma Studio
```

## Environment Variables

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/quranmemorizer

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Email (for verification)
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@quranmemorizer.app

# APIs
HUGGINGFACE_API_KEY=
QURAN_API_URL=https://api.alquran.cloud/v1
```

## Custom Agents for Development

Use these agent prompts when working on specific areas of the application.

---

### Agent: quran-data-agent

**Purpose**: Handle all Quran data fetching, caching, and processing
**When to use**: Working on Quran text display, translations, or data fetching
**Responsibilities**:

- Fetch Surah/Ayah data from AlQuran.cloud API
- Cache Quran text and translations in IndexedDB
- Process and normalize Arabic text
- Handle multiple script formats (Uthmani, IndoPak)
- Integrate with QUL API for mushaf layouts
- Manage word-by-word data

**Key Files**:

- `src/lib/quran/api.ts`
- `src/lib/quran/utils.ts`
- `src/types/quran.ts`
- `src/stores/quranStore.ts`

---

### Agent: mushaf-renderer-agent

**Purpose**: Handle page-accurate Mushaf rendering matching physical copies
**When to use**: Working on Quran page display, layout rendering, or font issues
**Responsibilities**:

- Parse mushaf layout databases (JSON from QUL)
- Render pages with exact line breaks as physical Mushaf
- Handle Arabic text justification per line
- Support multiple editions (Madinah 1421H, 1441H, IndoPak)
- Implement Tajweed color coding overlay
- Manage Arabic font loading (KFGQPC, Amiri, Nastaleeq)

**Key Files**:

- `src/lib/quran/mushafRenderer.ts`
- `src/lib/quran/layoutParser.ts`
- `src/components/quran/MushafPage/`
- `src/components/quran/MushafLine/`
- `src/components/quran/MushafWord/`
- `src/data/mushaf-layouts/`

**Resources**:

- QUL Layouts: https://qul.tarteel.ai/mushaf_layouts
- Layout Docs: https://qul.tarteel.ai/docs/mushaf-layout

---

### Agent: voice-recognition-agent

**Purpose**: Manage all voice/speech recognition functionality
**When to use**: Working on recitation tracking, voice search, or transcription
**Responsibilities**:

- Initialize Web Speech API with Arabic (ar-SA, ar-EG)
- Process Arabic voice input in real-time
- Send audio to Whisper API when browser API fails
- Handle real-time transcription with interim results
- Implement voice search ("Shazam for Quran")
- Match transcribed text to Quran verses

**Key Files**:

- `src/lib/speech/recognition.ts`
- `src/lib/speech/whisper.ts`
- `src/components/voice/VoiceRecorder/`
- `src/components/voice/VoiceSearch/`
- `src/components/voice/RecitationTracker/`

**Resources**:

- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- Whisper Model: https://huggingface.co/tarteel-ai/whisper-base-ar-quran

---

### Agent: memorization-agent

**Purpose**: Handle memorization mode logic and mistake detection
**When to use**: Working on hidden verses, mistake detection, or session tracking
**Responsibilities**:

- Compare recited text with original Quran text
- Detect word-level mistakes using fuzzy matching
- Track skipped words and word order errors
- Identify tashkeel (diacritical) errors
- Generate mistake reports with severity levels
- Handle progressive verse revealing
- Manage memorization sessions

**Key Files**:

- `src/lib/memorization/mistakeDetector.ts`
- `src/lib/memorization/session.ts`
- `src/components/memorization/HiddenVerse/`
- `src/components/memorization/MistakeHighlight/`
- `src/components/memorization/ProgressiveReveal/`
- `src/components/memorization/SessionSummary/`

**Algorithm Notes**:

```typescript
// Mistake types to detect
type MistakeType =
  | "wrong_word" // Incorrect word recited
  | "skipped" // Word was skipped
  | "added" // Extra word inserted
  | "tashkeel" // Diacritical mark error
  | "order"; // Words in wrong order
```

---

### Agent: progress-tracking-agent

**Purpose**: Manage all progress, goals, and gamification
**When to use**: Working on streaks, badges, analytics, or goals
**Responsibilities**:

- Track daily streaks with timezone handling
- Calculate progress statistics (pages, ayahs, accuracy)
- Manage goals (create, update, complete)
- Award badges based on achievements
- Generate analytics reports and heatmaps
- Handle leaderboard rankings

**Key Files**:

- `src/lib/analytics/progress.ts`
- `src/lib/analytics/streaks.ts`
- `src/lib/analytics/badges.ts`
- `src/stores/progressStore.ts`
- `src/components/gamification/StreakDisplay/`
- `src/components/gamification/BadgeSystem/`
- `src/components/gamification/Leaderboard/`
- `src/app/(main)/progress/page.tsx`

**Badge Definitions**:

- First Recitation, 7/30/100-Day Streaks
- Surah Completion, Juz Completion
- Perfect Session, Night Owl, Early Bird

---

### Agent: audio-agent

**Purpose**: Handle all audio playback and recording
**When to use**: Working on audio player, Qari selection, or recording
**Responsibilities**:

- Manage audio player state (play, pause, seek)
- Handle Qari audio streaming from multiple sources
- Implement playback controls (speed, loop, volume)
- Record user recitations with MediaRecorder API
- Cache audio for offline playback
- Sync audio with text highlighting

**Key Files**:

- `src/lib/audio/player.ts`
- `src/lib/audio/recorder.ts`
- `src/stores/audioStore.ts`
- `src/components/quran/AudioPlayer/`
- `src/hooks/useAudioPlayer.ts`

**Audio Sources**:

- everyayah.com - Full Quran recitations
- verses.quran.com - Word-level audio
- QUL - 62 reciters with timestamps

---

### Agent: ui-components-agent

**Purpose**: Build and maintain UI components with shadcn/ui
**When to use**: Creating new components, styling, or accessibility fixes
**Responsibilities**:

- Build components using shadcn/ui + Tailwind
- Ensure RTL support for Arabic content
- Implement dark/light/sepia themes
- Handle responsive design (mobile-first)
- Ensure WCAG accessibility compliance
- Create loading skeletons and error states

**Key Files**:

- `src/components/ui/` (shadcn components)
- `src/app/globals.css`
- `tailwind.config.ts`

**Guidelines**:

- Use `dir="rtl"` for Arabic text containers
- Use CSS logical properties (start/end vs left/right)
- Test with screen readers
- Support keyboard navigation

---

### Agent: pwa-offline-agent

**Purpose**: Handle PWA setup at offline functionality
**When to use**: Working on Service Worker, caching, or offline features
**Responsibilities**:

- Configure next-pwa with caching strategies
- Cache Quran text data for offline access
- Implement audio download manager
- Handle background sync for progress data
- Create install prompt UI
- Manage push notifications

**Key Files**:

- `next.config.js` (PWA config)
- `public/manifest.json`
- `src/lib/offline/cache.ts`
- `src/lib/offline/sync.ts`
- `src/components/pwa/InstallPrompt/`
- `src/components/pwa/OfflineIndicator/`

**Caching Strategy**:

- Quran text: Cache-first (static)
- Translations: Stale-while-revalidate
- Audio: Cache on-demand + background download
- API responses: Network-first with fallback

---

### Agent: testing-agent

**Purpose**: Write and maintain tests
**When to use**: Writing unit tests, component tests, or E2E tests
**Responsibilities**:

- Write unit tests for utility functions
- Create component tests with React Testing Library
- Build E2E tests with Playwright
- Mock voice recognition for testing
- Test Arabic text rendering
- Verify offline functionality

**Key Files**:

- `src/**/*.test.ts`
- `src/**/*.test.tsx`
- `e2e/*.spec.ts`
- `playwright.config.ts`
- `jest.config.js`

**Testing Priorities**:

1. Mistake detection algorithm
2. Mushaf rendering accuracy
3. Audio player controls
4. Progress/streak calculations
5. Authentication flows

---

### Agent: database-agent

**Purpose**: Handle database schema and queries
**When to use**: Working on Prisma schema, migrations, or queries
**Responsibilities**:

- Design and update Prisma schema
- Write efficient database queries
- Handle migrations
- Optimize query performance
- Manage user data relationships

**Key Files**:

- `prisma/schema.prisma`
- `src/lib/db/`
- `src/app/api/*/route.ts`

**Commands**:

```bash
npx prisma db push      # Push schema changes
npx prisma generate     # Generate client
npx prisma studio       # Open GUI
npx prisma migrate dev  # Create migration
```

## Future: Mobile & Desktop Apps (Placeholder)

### Monorepo Structure (Future)

```
packages/
├── core/                 # Shared business logic
│   ├── quran/           # Quran data utilities
│   ├── memorization/    # Mistake detection
│   └── types/           # TypeScript types
├── web/                 # Next.js web app (current)
├── mobile/              # React Native / Expo app (future)
└── desktop/             # Tauri desktop app (future)
```

### Mobile App (React Native / Expo)

- Share core logic with web
- Native voice recognition
- Background audio playback
- Push notifications
- App Store / Play Store

### Desktop App (Tauri)

- Lightweight Rust-based wrapper
- System tray integration
- Global keyboard shortcuts
- Full offline support
- Windows / macOS / Linux

## Code Style Guidelines

- Use TypeScript strict mode
- Follow React Server Components patterns
- Implement proper error boundaries
- Use Suspense for loading states
- Implement proper accessibility (ARIA)
- RTL support for Arabic content
- Mobile-first responsive design

## Testing Strategy

- Unit tests for utility functions
- Component tests with React Testing Library
- E2E tests with Playwright
- Voice recognition mocking for tests

## Performance Targets

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Offline support via Service Worker
- Audio preloading for smooth playback
