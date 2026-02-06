Push the Prisma schema to the database.

Steps:

1. Check that DATABASE_URL is set in .env
2. Run `npx prisma generate` to generate the Prisma client
3. Run `npx prisma db push` to sync schema with database
4. Report success or any errors (connection issues, schema conflicts)
5. If there are errors, suggest fixes (e.g., missing env var, PostgreSQL not running)
