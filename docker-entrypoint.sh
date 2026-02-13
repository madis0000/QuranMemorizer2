#!/bin/sh
set -e

echo "=== QuranMemorizer 2.0 Startup ==="

# 1. Push Prisma schema (creates tables if missing)
echo "Pushing Prisma schema..."
npx prisma db push --skip-generate 2>&1 || echo "Warning: db push failed, tables may already exist"

# 2. Seed if QuranSurah table is empty
echo "Checking if seed is needed..."
SURAH_COUNT=$(node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT COUNT(*) FROM \"QuranSurah\"')
  .then(r => { console.log(r.rows[0].count); pool.end(); })
  .catch(() => { console.log('0'); pool.end(); });
" 2>/dev/null || echo "0")

if [ "$SURAH_COUNT" = "0" ]; then
  echo "Database empty, running full seed..."
  npx tsx prisma/seed.ts 2>&1 || echo "Warning: seed failed, will retry on next restart"
else
  echo "Database already seeded ($SURAH_COUNT surahs found). Skipping."
fi

# 3. Create search index (idempotent, safe to re-run)
echo "Ensuring search index exists..."
npx tsx prisma/seed.ts --search-index 2>&1 || echo "Warning: search index creation failed"

# 4. Start the Next.js server
echo "Starting Next.js server..."
exec node server.js
