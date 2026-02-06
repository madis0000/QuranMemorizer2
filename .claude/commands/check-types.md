Run TypeScript type checking on the entire project.

Steps:

1. Run `npx tsc --noEmit` to check for type errors without emitting files
2. Parse the output and group errors by file
3. For each error, show:
   - File path and line number
   - The error message
   - A suggested fix
4. Report total error count and affected files
5. If clean, report "No type errors found"
