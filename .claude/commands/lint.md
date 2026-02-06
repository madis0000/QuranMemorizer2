Run linting and formatting on the codebase.

Steps:

1. Run `npm run lint` (ESLint) and capture output
2. Run `npx prettier --check "src/**/*.{ts,tsx,js,jsx,json,css}"` to check formatting
3. Report any lint errors or warnings grouped by file
4. If there are auto-fixable issues, run `npm run lint -- --fix` and `npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css}"`
5. Report final status: clean or remaining manual fixes needed
