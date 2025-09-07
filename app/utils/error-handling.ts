/**
 * Enhanced error handling utilities
 * Provides consistent error handling across the application
 */

import { z } from "zod";

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  stack?: string;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

/**
 * Create a standardized error object
 */
export function createAppError(
  code: string,
  message: string,
  details?: any,
  context?: ErrorContext
): AppError {
  return {
    code,
    message,
    details,
    timestamp: new Date(),
    stack: new Error().stack,
    ...context,
  };
}

/**
 * Handle validation errors
 */
export function handleValidationError(
  error: z.ZodError,
  context?: ErrorContext
): AppError {
  const message = error.issues
    .map((err: z.ZodIssue) => {
      const path = err.path.length > 0 ? `${err.path.join(".")}: ` : "";
      return `${path}${err.message}`;
    })
    .join(", ");

  return createAppError(
    "VALIDATION_ERROR",
    `Validation failed: ${message}`,
    error.issues,
    context
  );
}

/**
 * Handle API errors
 */
export function handleApiError(error: any, context?: ErrorContext): AppError {
  const code = error.response?.status
    ? `API_ERROR_${error.response.status}`
    : "API_ERROR";
  const message =
    error.response?.data?.message || error.message || "An API error occurred";

  return createAppError(
    code,
    message,
    {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    },
    context
  );
}

/**
 * Handle network errors
 */
export function handleNetworkError(
  error: any,
  context?: ErrorContext
): AppError {
  return createAppError(
    "NETWORK_ERROR",
    "Network request failed",
    {
      message: error.message,
      code: error.code,
    },
    context
  );
}

/**
 * Handle unknown errors
 */
export function handleUnknownError(
  error: any,
  context?: ErrorContext
): AppError {
  return createAppError(
    "UNKNOWN_ERROR",
    error.message || "An unknown error occurred",
    error,
    context
  );
}

/**
 * Log error to console in development
 */
export function logError(error: AppError): void {
  if (process.env.NODE_ENV === "development") {
    console.error("App Error:", error);
  }
}

/**
 * Send error to monitoring service in production
 */
export function reportError(error: AppError): void {
  if (process.env.NODE_ENV === "production") {
    // In a real app, you would send this to your error monitoring service
    // like Sentry, LogRocket, etc.
    console.error("Error reported:", error);
  }
}

/**
 * Handle error with logging and reporting
 */
export function handleError(error: any, context?: ErrorContext): AppError {
  let appError: AppError;

  if (error instanceof z.ZodError) {
    appError = handleValidationError(error, context);
  } else if (error.response) {
    appError = handleApiError(error, context);
  } else if (error.code === "NETWORK_ERROR" || !navigator.onLine) {
    appError = handleNetworkError(error, context);
  } else {
    appError = handleUnknownError(error, context);
  }

  logError(appError);
  reportError(appError);

  return appError;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Timeout wrapper for promises
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = "Operation timed out"
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    }),
  ]);
}
