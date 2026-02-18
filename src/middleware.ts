import { type NextRequest, NextResponse } from "next/server";

import { authConfig } from "@/lib/auth/config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

// Security headers applied to all responses
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "0",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(self), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: https://verses.quran.com https://everyayah.com https://*.everyayah.com",
    "connect-src 'self' https://api.alquran.cloud https://api.quran.com https://api-inference.huggingface.co https://qul.tarteel.ai",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
  ].join("; "),
};

export default auth((_req: NextRequest & { auth?: unknown }) => {
  const response = NextResponse.next();

  // Apply security headers to every response
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  return response;
});

export const config = {
  // Run middleware on all routes except static files and Next.js internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/|sw.js|workbox-).*)",
  ],
};
