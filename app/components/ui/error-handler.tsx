"use client";

import { useEffect } from "react";

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Log to external service in production
      if (import.meta.env.PROD) {
        // TODO: Send to error tracking service (Sentry, etc.)
      } else {
        console.error("🚨 Unhandled promise rejection:", event.reason);
      }
    };

    // Handle general errors
    const handleError = (event: ErrorEvent) => {
      // Log to external service in production
      if (import.meta.env.PROD) {
        // TODO: Send to error tracking service (Sentry, etc.)
      } else {
        console.error("🚨 Global error:", event.error || event.message);
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
