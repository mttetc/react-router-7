"use client";

import { useEffect } from "react";

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("🚨 Unhandled promise rejection:", event.reason);
    };

    // Handle general errors
    const handleError = (event: ErrorEvent) => {
      console.error("🚨 Global error:", event.error || event.message);
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
