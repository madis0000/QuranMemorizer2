import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getRedis } from "@/lib/redis";

/**
 * GET /api/health
 * Health check endpoint for container orchestration and monitoring.
 * Does NOT require authentication.
 */
export async function GET() {
  const checks: Record<string, "ok" | "error"> = {
    database: "error",
    redis: "error",
  };

  // Check database
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    checks.database = "ok";
  } catch {
    // database unreachable
  }

  // Check Redis
  try {
    const redis = getRedis();
    const pong = await redis.ping();
    checks.redis = pong === "PONG" ? "ok" : "error";
  } catch {
    // redis unreachable — non-critical
  }

  const isHealthy = checks.database === "ok";
  const status = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      checks,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
