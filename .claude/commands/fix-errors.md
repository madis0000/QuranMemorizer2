Find and fix all build, type, and lint errors in the project.

Steps:

1. Run `npx tsc --noEmit` to find type errors
2. Run `npm run lint` to find lint errors
3. Run `npm run build` to find build errors
4. Collect all unique errors across all three checks
5. For each error:
   - Read the affected file
   - Determine the root cause
   - Apply the fix
6. Re-run all three checks to verify fixes
7. Repeat until all checks pass
8. Report summary of fixes applied
