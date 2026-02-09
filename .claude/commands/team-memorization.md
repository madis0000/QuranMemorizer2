Activate **Team Memorization Engine** agent context for FSRS, progressive hide modes, similar verse trainer, and traditional methods.

You are now **Team Memorization Engine**. Your mission is to build the most scientifically-advanced and culturally-authentic memorization system in any Quran app.

## Priority 1: FSRS-6 Upgrade (Replace SM-2)

Current SM-2 implementation: `src/lib/memorization/srs.ts` (173 lines)
Current API: `src/app/api/progress/srs/route.ts` (186 lines, stores cards in user.settings JSON)

**Action**: Replace with FSRS-6 via `ts-fsrs` npm package:

- FSRS achieves 99.6% superiority over SM-2 in A/B tests
- 20-30% fewer reviews for the same retention rate
- Three Component Model: Stability, Retrievability, Difficulty
- 21 optimizable parameters trained on 700M+ reviews

```typescript
// ts-fsrs usage pattern
import { fsrs, generatorParameters, Rating } from "ts-fsrs";

const f = fsrs(generatorParameters({ enable_fuzz: true }));
const card = createEmptyCard();
const scheduling = f.repeat(card, new Date());
// scheduling[Rating.Good].card, scheduling[Rating.Again].card, etc.
```

- Migrate from JSON-in-settings to dedicated `FSRSCard` Prisma model
- Build review queue UI with: Again / Hard / Good / Easy buttons
- Show next review dates for each rating
- Display retention probability and card statistics

## Priority 2: Progressive Hide Modes (8 Strategies)

Current: `src/components/memorization/HiddenVerse.tsx` (blur effect, tap-to-reveal)

Build 8 distinct hide modes:

| Mode                   | Implementation                                                          |
| ---------------------- | ----------------------------------------------------------------------- |
| **Full Hide**          | All words → `___`, current behavior enhanced                            |
| **First Letter**       | Show only first Arabic letter of each word (from V1's Memory Challenge) |
| **Random Blank**       | Progressive: hide 20% → 40% → 60% → 80% → 100%                          |
| **Translation Recall** | Show English/Urdu translation, recite Arabic from memory                |
| **Audio Recall**       | Play Qari audio, then recite without text visible                       |
| **Reverse Recall**     | Given last word of verse, recite previous verse                         |
| **Context Recall**     | Show surrounding verses, fill in the missing one                        |
| **Keyword Mode**       | Only show content words, hide particles (من، في، على، إلى)              |

**V1 Reference**: V1's Memory Challenge mode in PracticeMode.tsx preserves Tajweed colors even in partial reveals. Port this pattern.

## Priority 3: Similar Verse Trainer (UNIQUE - NO COMPETITOR HAS THIS)

The #1 struggle for Huffaz is Mutashabihat (similar verses). Build:

**Detection Algorithm**:

```typescript
// Compare all 6236 verses pairwise (or use smart heuristics)
// Word-level overlap using normalized Arabic text
// Categories: near_identical (>90%), similar_opening (first 3+ words match),
//             similar_ending (last 3+ words match), thematic_similar (>70% overlap)
```

**Components to build**:

- `src/lib/similar-verses/detector.ts` - Pairwise comparison engine
- `src/lib/similar-verses/drills.ts` - Generate practice exercises
- `src/components/memorization/SimilarVerseComparison.tsx` - Side-by-side with diff highlighting
- `src/components/memorization/SimilarVerseDrill.tsx` - "Which surah?" quiz, continuation drill
- `src/app/(main)/similar-verses/page.tsx` - Dedicated trainer page
- `src/app/api/quran/similar/route.ts` - API for similar verse pairs

**Pre-built sets**: Common confusion pairs every Hafiz knows (e.g., "Wa idh qulna..." appears in Al-Baqarah multiple times with subtle differences)

## Priority 4: Traditional Memorization Methods (Digitized)

### Mauritanian Method (Mastery Gates)

- Student must achieve 95%+ accuracy before advancing to next verse
- No skipping ahead — enforced sequential mastery
- Teacher review checkpoints (can be automated or peer-reviewed)

### 3x3 Method

- Read verse 3 times (with text visible)
- Recite from memory 3 times (text hidden)
- Combine: recite current + all previous verses in set
- Sets of 3-5 verses, then combine sets

### Sabaq/Sabqi/Manzil System

- **Sabaq (New Lesson)**: Today's new verses to memorize
- **Sabqi (Recent Review)**: Last 7 days' verses for consolidation
- **Manzil (Distant Review)**: Older memorized verses for maintenance
- Each category tracked separately with distinct FSRS parameters
- Daily session auto-populates from each category

### Ottoman Method

- Page-by-page memorization (not verse-by-verse)
- Bi-weekly review cycles of all memorized pages
- Groups of 20 pages (approx 1 juz) for review blocks

## Priority 5: Memory Palace Mode

The physical Mushaf IS a spatial memory palace:

- `src/components/memorization/PageMasteryHeatmap.tsx` - 604-page grid colored by strength
- Position recall drills: "What verse starts on page X, line Y?"
- Page-level SRS scheduling (in addition to verse-level)
- Visual anchoring: highlight verse positions on page

## Key Existing Files

- `src/lib/memorization/mistakeDetector.ts` (424 lines) - LCS alignment, 5 mistake types
- `src/lib/memorization/arabic-utils.ts` (155 lines) - Normalization, Levenshtein
- `src/lib/memorization/srs.ts` (173 lines) - Current SM-2 (to be replaced)
- `src/components/memorization/HiddenVerse.tsx` - Blur/reveal
- `src/components/memorization/MistakeHighlight.tsx` - Color-coded feedback
- `src/components/memorization/ProgressiveReveal.tsx` - Animated reveal
- `src/components/memorization/SessionSummary.tsx` - Post-session stats
- `src/components/memorization/SurahAyahPicker.tsx` - Range selector
- `src/stores/sessionStore.ts` - Session state machine
- `src/app/(main)/memorize/page.tsx` - Memorization page

## V1 Algorithms to Port

From V1's `lib/arabicUtils.ts` (13.5KB):

- 10-step normalization pipeline (more comprehensive than V2's 8-step)
- Superscript Alef handling (U+0670 → regular Alef, not removed)
- Muqatta'at letter mapping (`الم` → `['الف', 'لام', 'ميم']`) for speech recognition
- Multi-strategy word matching: exact → Muqatta'at → normalize → superscript → substring → Levenshtein
- `alignWords()` with 3-word lookahead for error recovery

From V1's `lib/memorization/gamification.ts`:

- 6 Mastery Levels: None → Bronze (70%/3) → Silver (80%/5) → Gold (90%/7) → Platinum (95%/10) → Master (98%/15)
- Apply to verse-level, page-level, and surah-level mastery

From V1's `lib/memorization/contexts.ts`:

- 10 thematic contexts with Arabic titles, descriptions, verse references
- Port as curated memorization starting points

## Guidelines

- FSRS cards must have their own Prisma model (not JSON-in-settings)
- All hide modes should be selectable from memorize page settings
- Similar verse detection can be pre-computed and stored in SimilarVersePair table
- Traditional methods should be selectable per study plan
- Preserve existing mistakeDetector.ts quality — it's production-ready
- Ensure all modes work with voice recognition integration

Work on the task described in $ARGUMENTS.
