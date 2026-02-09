import { NextResponse } from "next/server";

import { getRedis } from "./redis";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export async function rateLimit(
  identifier: string,
  maxRequests: number = 60,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  try {
    const redis = getRedis();
    const key = `rate:${identifier}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);

    return {
      allowed: current <= maxRequests,
      remaining: Math.max(0, maxRequests - current),
      resetAt: Date.now() + ttl * 1000,
    };
  } catch {
    // Redis unavailable - allow all requests
    return {
      allowed: true,
      remaining: maxRequests,
      resetAt: Date.now() + windowSeconds * 1000,
    };
  }
}

export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
