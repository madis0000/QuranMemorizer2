import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { z } from "zod";

describe("env validation", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("validates DATABASE_URL is a PostgreSQL connection string", () => {
    const schema = z.object({
      DATABASE_URL: z
        .string()
        .min(1)
        .startsWith("postgresql://"),
    });

    // Valid
    expect(
      schema.safeParse({ DATABASE_URL: "postgresql://user:pass@host:5432/db" })
        .success
    ).toBe(true);

    // Invalid — not a postgresql URL
    expect(
      schema.safeParse({ DATABASE_URL: "mysql://user:pass@host:3306/db" })
        .success
    ).toBe(false);

    // Invalid — empty
    expect(schema.safeParse({ DATABASE_URL: "" }).success).toBe(false);
  });

  it("validates NEXTAUTH_SECRET minimum length", () => {
    const schema = z.object({
      NEXTAUTH_SECRET: z.string().min(16),
    });

    expect(
      schema.safeParse({ NEXTAUTH_SECRET: "short" }).success
    ).toBe(false);

    expect(
      schema.safeParse({
        NEXTAUTH_SECRET: "this-is-a-long-enough-secret-key",
      }).success
    ).toBe(true);
  });

  it("allows optional OAuth env vars", () => {
    const schema = z.object({
      GOOGLE_CLIENT_ID: z.string().optional(),
      GOOGLE_CLIENT_SECRET: z.string().optional(),
    });

    expect(schema.safeParse({}).success).toBe(true);
    expect(
      schema.safeParse({
        GOOGLE_CLIENT_ID: "id",
        GOOGLE_CLIENT_SECRET: "secret",
      }).success
    ).toBe(true);
  });

  it("validates LOG_LEVEL enum", () => {
    const schema = z.object({
      LOG_LEVEL: z
        .enum(["fatal", "error", "warn", "info", "debug", "trace"])
        .optional()
        .default("info"),
    });

    expect(schema.safeParse({}).data?.LOG_LEVEL).toBe("info");
    expect(schema.safeParse({ LOG_LEVEL: "debug" }).data?.LOG_LEVEL).toBe(
      "debug"
    );
    expect(schema.safeParse({ LOG_LEVEL: "invalid" }).success).toBe(false);
  });
});
