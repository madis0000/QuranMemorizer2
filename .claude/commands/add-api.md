Scaffold a new API route with authentication pattern.

Usage: /add-api $ARGUMENTS

Steps:

1. Parse the route path from $ARGUMENTS (e.g., "user/profile", "quran/bookmarks")
2. Create the route.ts file at `src/app/api/<path>/route.ts`
3. Include the standard pattern:
   ```typescript
   import { NextResponse } from "next/server";

   import { auth } from "@/lib/auth";
   import { prisma } from "@/lib/db";
   ```
4. Add GET and POST handlers (or as specified) with:
   - Session authentication check
   - Prisma query placeholder
   - Proper error handling (401, 400, 500)
   - NextResponse.json() returns
5. If dynamic route segments are needed, include proper params typing
6. Report the new file path
