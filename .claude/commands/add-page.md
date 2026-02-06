Scaffold a new Next.js App Router page.

Usage: /add-page $ARGUMENTS

Steps:

1. Parse the route path from $ARGUMENTS (e.g., "dashboard", "quran/[surah]", "admin/users")
2. Determine the correct directory under `src/app/`
3. Create the page.tsx file with:
   - Proper TypeScript types for params/searchParams
   - Metadata export for SEO
   - A basic layout structure matching existing pages
   - Proper imports from @/components/ui
4. If the route has dynamic segments ([param]), include proper typing
5. If a layout.tsx is needed for the route group, create it
6. Report the new file paths created
