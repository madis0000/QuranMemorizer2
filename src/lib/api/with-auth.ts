import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

import { auth } from "@/lib/auth";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

import { apiError, handleApiError } from "./errors";

type AuthenticatedHandler = (
  request: NextRequest,
  context: { userId: string; session: Session }
) => Promise<Response>;

interface WithAuthOptions {
  /** Rate limit: max requests per window. Default: 60. Set to 0 to disable. */
  maxRequests?: number;
  /** Rate limit: window in seconds. Default: 60. */
  windowSeconds?: number;
}

/**
 * Wraps an API route handler with authentication + rate limiting.
 *
 * Usage:
 * ```ts
 * export const POST = withAuth(async (request, { userId }) => {
 *   // userId is guaranteed non-null here
 *   return NextResponse.json({ ok: true });
 * }, { maxRequests: 30 });
 * ```
 */
export function withAuth(
  handler: AuthenticatedHandler,
  options: WithAuthOptions = {}
) {
  const { maxRequests = 60, windowSeconds = 60 } = options;

  return async (request: NextRequest, _routeContext?: unknown) => {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        return apiError("UNAUTHORIZED", "Authentication required");
      }

      const userId = session.user.id;

      // Rate limiting (skip if maxRequests is 0)
      if (maxRequests > 0) {
        // Extract pathname for rate limit key scoping
        const pathname = new URL(request.url).pathname;
        const rl = await rateLimit(
          `${userId}:${pathname}`,
          maxRequests,
          windowSeconds
        );
        if (!rl.allowed) {
          return rateLimitResponse();
        }
      }

      return await handler(request, { userId, session: session as Session });
    } catch (error) {
      const pathname = new URL(request.url).pathname;
      return handleApiError(error, pathname);
    }
  };
}
