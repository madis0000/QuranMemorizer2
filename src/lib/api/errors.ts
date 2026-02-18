import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { logger } from "@/lib/logger";

/**
 * Standardized API error response format.
 *
 * All error responses follow:
 * { error: { code: string, message: string, details?: unknown[] } }
 */

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "PAYLOAD_TOO_LARGE"
  | "INTERNAL_ERROR"
  | "SERVICE_UNAVAILABLE";

interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown[];
  };
}

const statusMap: Record<ApiErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  RATE_LIMITED: 429,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export function apiError(
  code: ApiErrorCode,
  message: string,
  details?: unknown[]
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: { code, message, ...(details && { details }) } },
    { status: statusMap[code] }
  );
}

/**
 * Convert ZodError into a standardized validation error response.
 */
export function validationError(error: ZodError): NextResponse<ApiErrorBody> {
  const details = error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
  return apiError("VALIDATION_ERROR", "Request validation failed", details);
}

/**
 * Catch-all error handler for API route try/catch blocks.
 * Logs the error and returns a generic 500 response.
 */
export function handleApiError(
  error: unknown,
  context: string
): NextResponse<ApiErrorBody> {
  logger.error({ err: error, context }, `API error in ${context}`);
  return apiError("INTERNAL_ERROR", "Internal server error");
}
