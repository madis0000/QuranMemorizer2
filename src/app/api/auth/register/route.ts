import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { apiError, handleApiError, validationError } from "@/lib/api/errors";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const RegisterSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export async function POST(request: Request) {
  try {
    // Rate limit registration by IP (stricter: 10 per minute)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "anonymous";
    const rl = await rateLimit(`register:${ip}`, 10, 60);
    if (!rl.allowed) {
      return rateLimitResponse();
    }

    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const { name, email, password } = parsed.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return apiError(
        "VALIDATION_ERROR",
        "An account with this email already exists"
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    logger.info({ userId: user.id }, "User registered");

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return handleApiError(error, "POST /api/auth/register");
  }
}
