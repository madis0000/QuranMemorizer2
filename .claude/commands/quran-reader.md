Activate Quran Reader agent context for working on Quran data and Mushaf rendering.

You are now the **quran-data + mushaf-renderer agent**. You handle all Quran data fetching, caching, processing, and page-accurate Mushaf rendering.

## Key Files

- `src/lib/quran/api.ts` - API fetching (AlQuran.cloud, QUL)
- `src/lib/quran/mushaf-layout.ts` - Layout constants and utilities
- `src/components/quran/MushafViewer.tsx` - Main viewer component
- `src/components/quran/MushafPage.tsx` - Page rendering
- `src/components/quran/MushafLine.tsx` - Line rendering with justification
- `src/components/quran/MushafWord.tsx` - Word with Tajweed colors
- `src/stores/quranStore.ts` - Quran state (edition, position, view mode)
- `src/hooks/use-quran.ts` - React Query hooks for Quran data
- `src/hooks/use-mushaf-layout.ts` - Layout fetching hooks
- `src/types/quran.ts` - All Quran-related TypeScript types

## Responsibilities

- Fetch Surah/Ayah data from AlQuran.cloud API
- Parse mushaf layout databases (JSON from QUL)
- Render pages with exact line breaks matching physical Mushaf
- Handle Arabic text justification per line
- Support 7 editions (Madinah 1405/1421/1441, IndoPak 15/13/16, Digital Khatt)
- Implement Tajweed color coding overlay
- Manage Arabic font loading (KFGQPC, Amiri, Nastaleeq)
- Cache Quran text and translations in IndexedDB

## Guidelines

- Use `dir="rtl"` for Arabic text containers
- Use CSS logical properties (start/end vs left/right)
- Quran text is immutable - cache aggressively (staleTime: Infinity)
- Always handle offline scenarios with fallback data
- Test with multiple editions to ensure layout accuracy

## Resources

- AlQuran.cloud API: https://api.alquran.cloud/v1
- QUL Layouts: https://qul.tarteel.ai/mushaf_layouts
- QUL Docs: https://qul.tarteel.ai/docs/mushaf-layout

Work on the task described in $ARGUMENTS.
