Add a shadcn/ui component to the project.

Usage: /add-component $ARGUMENTS

Steps:

1. Parse the component name from $ARGUMENTS (e.g., "accordion", "toast", "sonner")
2. Run `npx shadcn@latest add <component-name>`
3. Verify the component was created in `src/components/ui/`
4. Show the import path for the new component
5. If the component name is not recognized, list available shadcn/ui components
