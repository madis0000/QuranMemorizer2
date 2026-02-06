Build the project and report any errors with suggested fixes.

Steps:

1. Run `npm run build` and capture output
2. If build fails, analyze the errors
3. For each error, suggest a specific fix with file path and code change
4. If there are TypeScript errors, run `npx tsc --noEmit` for detailed type information
5. Apply fixes and re-run build until it passes
6. Report final build status with bundle size summary
