Analyze and improve application performance.

Steps:

1. Run `npm run build` and analyze the build output for bundle sizes
2. Check for:
   - Large dependencies that could be tree-shaken or replaced
   - Components that should use dynamic imports (next/dynamic)
   - Images without next/image optimization
   - Missing React.memo on expensive components
   - API routes without caching headers
   - Fonts not using next/font optimization
   - Missing Suspense boundaries for streaming
3. Check Core Web Vitals readiness:
   - LCP: Large content above the fold loads fast
   - FID/INP: No heavy JS blocking main thread
   - CLS: No layout shifts from dynamic content
4. Report findings with specific optimization suggestions and estimated impact
