Run the test suite and report results.

Steps:

1. Check if Vitest is configured (look for vitest.config.ts)
2. If not configured, set up Vitest with React Testing Library:
   - Install: vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
   - Create vitest.config.ts with proper aliases and setup
3. Run `npx vitest run` to execute all tests
4. Report: total tests, passed, failed, skipped
5. For any failures, show the test name, expected vs actual, and suggest fixes
6. If no tests exist, suggest priority test files to create based on the codebase
