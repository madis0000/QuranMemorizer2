Review code quality, security, and accessibility.

Usage: /review-code $ARGUMENTS (optional: specific file or directory path)

Steps:

1. If $ARGUMENTS specifies a file/directory, focus there; otherwise review recent changes (git diff)
2. Check for:
   - **Security**: XSS, injection, exposed secrets, unsafe eval, missing auth checks
   - **Performance**: Unnecessary re-renders, missing memoization, large bundles, N+1 queries
   - **Accessibility**: Missing ARIA labels, keyboard navigation, RTL support for Arabic
   - **Best practices**: Error boundaries, loading states, proper TypeScript types
   - **Code quality**: Duplicate code, overly complex functions, missing error handling
3. Report findings grouped by severity (Critical, Warning, Info)
4. Provide specific file:line references and suggested fixes
