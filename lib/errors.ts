import { logger } from "@/lib/logging/logger";

export interface ApiErrorBody {
  error: {
    message: string;
    code: string;
    requestId: string;
    details?: unknown;
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function apiErrorBody(error: ApiError, requestId: string): ApiErrorBody {
  return {
    error: {
      message: error.message,
      code: error.code,
      requestId,
      details: error.details,
    },
  };
}

/**
 * Central capture point for unexpected errors. Currently logs structured
 * JSON; swap the body for `Sentry.captureException(error, { extra })` once
 * the Sentry SDK is wired in — call sites don't need to change.
 */
export function captureError(error: unknown, extra?: Record<string, unknown>): void {
  logger.error(error instanceof Error ? error.message : "Unknown error", {
    stack: error instanceof Error ? error.stack : undefined,
    ...extra,
  });
}
