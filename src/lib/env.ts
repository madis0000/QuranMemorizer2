import { z } from "zod";

/**
 * Server-side environment variable validation.
 * Validates at import time — app crashes fast on missing config.
 */
const serverEnvSchema = z.object({
  // Database (required)
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .startsWith("postgresql://", "DATABASE_URL must be a PostgreSQL connection string"),

  // Redis (optional)
  REDIS_URL: z.string().optional(),

  // NextAuth (required)
  NEXTAUTH_SECRET: z
    .string()
    .min(16, "NEXTAUTH_SECRET must be at least 16 characters"),
  NEXTAUTH_URL: z.string().url().optional(),

  // OAuth providers (all optional — disabled if absent)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_CLIENT_SECRET: z.string().optional(),

  // External APIs (optional)
  HUGGINGFACE_API_KEY: z.string().optional(),
  QURAN_API_URL: z.string().url().optional(),

  // Logging
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .optional()
    .default("info"),

  // Runtime
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function validateEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    console.error(
      `\n❌ Invalid environment variables:\n${formatted}\n\nSee .env.example for required values.\n`
    );

    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = validateEnv();
