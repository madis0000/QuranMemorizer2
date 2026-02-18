import { describe, expect, it } from "vitest";
import { ZodError, z } from "zod";

import { apiError, validationError } from "../errors";

describe("apiError", () => {
  it("returns correct status code for UNAUTHORIZED", async () => {
    const response = apiError("UNAUTHORIZED", "Not logged in");
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error.code).toBe("UNAUTHORIZED");
    expect(body.error.message).toBe("Not logged in");
  });

  it("returns correct status code for VALIDATION_ERROR", async () => {
    const response = apiError("VALIDATION_ERROR", "Bad input", [
      { field: "email", message: "Required" },
    ]);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details).toHaveLength(1);
    expect(body.error.details[0]).toEqual({
      field: "email",
      message: "Required",
    });
  });

  it("returns correct status code for RATE_LIMITED", async () => {
    const response = apiError("RATE_LIMITED", "Too many requests");
    expect(response.status).toBe(429);
  });

  it("returns correct status code for NOT_FOUND", async () => {
    const response = apiError("NOT_FOUND", "Resource not found");
    expect(response.status).toBe(404);
  });

  it("returns correct status code for PAYLOAD_TOO_LARGE", async () => {
    const response = apiError("PAYLOAD_TOO_LARGE", "File too big");
    expect(response.status).toBe(413);
  });

  it("returns correct status code for INTERNAL_ERROR", async () => {
    const response = apiError("INTERNAL_ERROR", "Something broke");
    expect(response.status).toBe(500);
  });

  it("omits details when not provided", async () => {
    const response = apiError("FORBIDDEN", "Access denied");
    const body = await response.json();
    expect(body.error.details).toBeUndefined();
  });
});

describe("validationError", () => {
  it("converts ZodError to standardized format", async () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(18),
    });

    const result = schema.safeParse({ email: "bad", age: 10 });
    expect(result.success).toBe(false);

    if (!result.success) {
      const response = validationError(result.error);
      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.error.code).toBe("VALIDATION_ERROR");
      expect(body.error.message).toBe("Request validation failed");
      expect(body.error.details).toBeInstanceOf(Array);
      expect(body.error.details.length).toBeGreaterThan(0);

      // Each detail should have field and message
      for (const detail of body.error.details) {
        expect(detail).toHaveProperty("field");
        expect(detail).toHaveProperty("message");
      }
    }
  });

  it("handles nested field paths", async () => {
    const schema = z.object({
      user: z.object({
        name: z.string().min(1),
      }),
    });

    const result = schema.safeParse({ user: { name: "" } });
    if (!result.success) {
      const response = validationError(result.error);
      const body = await response.json();
      const nameError = body.error.details.find(
        (d: { field: string }) => d.field === "user.name"
      );
      expect(nameError).toBeDefined();
    }
  });
});
