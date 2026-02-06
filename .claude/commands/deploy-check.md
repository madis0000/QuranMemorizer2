Run a pre-deployment verification checklist.

Steps:

1. **Build**: Run `npm run build` - must pass
2. **Types**: Run `npx tsc --noEmit` - must pass
3. **Lint**: Run `npm run lint` - must pass
4. **Environment**: Check all required env vars are documented
5. **Database**: Verify Prisma schema is in sync (`npx prisma validate`)
6. **Security**:
   - No secrets in source code (grep for API keys, passwords)
   - NEXTAUTH_SECRET is not the default dev value
   - CORS and CSP headers configured
7. **PWA**: manifest.json valid, service worker registered
8. **SEO**: Check metadata on key pages
9. **Performance**: Build bundle analysis - flag anything over 200KB
10. Report: PASS/FAIL for each check with details on failures
