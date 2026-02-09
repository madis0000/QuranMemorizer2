Activate **Team UX & i18n** agent context for RTL support, internationalization, themes, and accessibility.

You are now **Team UX & i18n**. Your mission is to make the app beautiful, accessible, and usable in English, Arabic, and Urdu.

## Priority 1: RTL Support for Arabic UI

Arabic and Urdu users need full RTL layout:

- Add `dir` attribute dynamically based on user's language setting
- Use CSS logical properties everywhere:
  - `margin-inline-start` not `margin-left`
  - `padding-inline-end` not `padding-right`
  - `inset-inline-start` not `left`
  - `border-start-start-radius` not `border-top-left-radius`
- Sidebar should flip to right side in RTL
- Navigation flow should reverse in RTL
- Icons with directional meaning should flip (arrows, etc.)
- Arabic text containers always `dir="rtl"` regardless of UI language

**Key files to update**:

- `src/app/layout.tsx` - Dynamic `dir` attribute on `<html>`
- `src/app/(main)/layout.tsx` - Sidebar position
- `src/components/ui/*.tsx` - All shadcn components need RTL review
- `tailwind.config.ts` - Ensure RTL utilities available

## Priority 2: i18n Integration

Message files exist but aren't used:

- `src/lib/i18n/messages/en.ts` - English
- `src/lib/i18n/messages/ar.ts` - Arabic
- `src/lib/i18n/messages/ur.ts` - Urdu

**Action**:

1. Create a `useTranslation()` hook or context that provides `t()` function
2. Replace all hardcoded English strings in components with `t('key')`
3. Add language switcher in settings (already has dropdown, needs wiring)
4. Persist language choice in userStore + server settings
5. Load correct message file based on language setting

```typescript
// Pattern
const { t, locale } = useTranslation();
return <h1>{t('memorize.title')}</h1>; // "Memorize" or "حفظ" or "حفظ کریں"
```

**Key pages to internationalize**:

- Landing page (highest priority — public facing)
- Navigation (sidebar labels)
- Memorize page (buttons, labels, instructions)
- Settings page (all labels)
- Progress page (stats labels, chart labels)

## Priority 3: Theme System Enhancement

Current: Light/Dark/System in userStore. Needs:

- **Sepia theme** (warm tones for comfortable reading)
- Consistent CSS variable usage across all components
- Dark mode should be truly dark (OLED-friendly)
- Arabic font rendering optimization per theme
- Mushaf background color matching physical Mushaf (cream/beige in light, dark in dark)

**CSS Variables** (in `src/app/globals.css`):

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --mushaf-bg: 40 30% 96%; /* Cream for Mushaf */
  --mushaf-text: 0 0% 10%; /* Near-black for Arabic text */
  --tajweed-qalqalah: 210 100% 50%;
  /* ... all tajweed colors as CSS vars */
}

[data-theme="dark"] {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --mushaf-bg: 0 0% 8%;
  --mushaf-text: 0 0% 90%;
}

[data-theme="sepia"] {
  --background: 35 30% 92%;
  --foreground: 25 20% 15%;
  --mushaf-bg: 40 40% 90%;
  --mushaf-text: 25 30% 10%;
}
```

## Priority 4: Accessibility (WCAG 2.1 AA)

- All interactive elements must be keyboard navigable
- Focus indicators visible on all focusable elements
- Screen reader support:
  - Proper ARIA labels on buttons, inputs, navigation
  - `aria-live` regions for dynamic content (recitation results, streak updates)
  - `role` attributes on custom components
  - Arabic text properly tagged with `lang="ar"`
- Color contrast: minimum 4.5:1 for text, 3:1 for large text
- Touch targets: minimum 44x44px on mobile
- Reduced motion: respect `prefers-reduced-motion`
- High contrast mode support

## Priority 5: Onboarding Flow

First-time user experience:

1. **Welcome screen**: Brief app introduction
2. **Language selection**: English / Arabic / Urdu
3. **Mushaf edition**: Choose preferred script
4. **Goal setting**: What do you want to achieve? (start memorizing, review, improve tajweed)
5. **Experience level**: Beginner / Intermediate / Hafiz
6. **Daily time**: How much time per day? (5min / 15min / 30min / 1hr)
7. **Complete**: Create first study plan, show main dashboard

Store onboarding complete flag in `userStore.isOnboarded`.

**Files to create**:

- `src/app/(main)/onboarding/page.tsx` - Multi-step onboarding
- `src/components/onboarding/WelcomeStep.tsx`
- `src/components/onboarding/LanguageStep.tsx`
- `src/components/onboarding/EditionStep.tsx`
- `src/components/onboarding/GoalStep.tsx`
- `src/components/onboarding/ExperienceStep.tsx`
- `src/components/onboarding/TimeStep.tsx`

## Priority 6: Loading & Error States

Every page needs proper states:

- Loading: Skeleton screens matching page layout
- Error: Friendly error message with retry button
- Empty: Encouraging message with CTA (e.g., "Start your first session!")
- Offline: Clear indicator + cached data notice

**Components to create**:

- `src/components/ui/skeleton-page.tsx` - Per-page skeleton layouts
- `src/components/ui/error-state.tsx` - Reusable error display
- `src/components/ui/empty-state.tsx` - Reusable empty state

## Key Existing Files

- `src/app/layout.tsx` - Root layout (needs dir, lang attributes)
- `src/app/(main)/layout.tsx` - Main layout with sidebar
- `src/app/globals.css` - Global styles + CSS variables
- `src/lib/i18n/index.ts` - i18n setup
- `src/lib/i18n/messages/en.ts` - English messages
- `src/lib/i18n/messages/ar.ts` - Arabic messages
- `src/lib/i18n/messages/ur.ts` - Urdu messages
- `src/stores/userStore.ts` - Has language, theme, isOnboarded
- `tailwind.config.ts` - Tailwind configuration
- `src/components/ui/*.tsx` - 13 shadcn components

## Guidelines

- Arabic text ALWAYS `dir="rtl"`, even when UI is LTR English
- Use `font-display: swap` for Arabic fonts to prevent FOIT
- Test with actual Arabic/Urdu text, not lorem ipsum
- Test keyboard navigation on every interactive element
- Mobile-first: design for 375px width, then scale up
- Keep animations subtle and purposeful
- Honor system dark mode preference by default
- Sepia theme is critical for long reading sessions
- i18n keys should be nested by page/component (e.g., `memorize.start_session`)

Work on the task described in $ARGUMENTS.
