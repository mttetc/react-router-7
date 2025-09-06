"use client";

import { useEffect } from "react";

export function GlobalErrorHandler() {
  useEffect(() => {
    // Store original console.error
    const originalConsoleError = console.error;
    
    // Override console.error to filter extension errors
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (
        message.includes("Could not establish connection") ||
        message.includes("Receiving end does not exist") ||
        message.includes("Extension context invalidated") ||
        message.includes("chrome-extension://") ||
        message.includes("moz-extension://") ||
        message.includes("safari-extension://")
      ) {
        // Silently ignore extension errors
        return;
      }
      // Call original console.error for legitimate errors
      originalConsoleError.apply(console, args);
    };
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason);

      // Filter out browser extension connection errors (more comprehensive patterns)
      if (
        errorMessage.includes("Could not establish connection") ||
        errorMessage.includes("Receiving end does not exist") ||
        errorMessage.includes("Extension context invalidated") ||
        errorMessage.includes("chrome-extension://") ||
        errorMessage.includes("moz-extension://") ||
        errorMessage.includes("safari-extension://") ||
        errorMessage.includes("The message port closed before a response was received") ||
        errorMessage.includes("Extension context invalidated") ||
        (event.reason instanceof Error && 
         event.reason.stack?.includes("chrome-extension://"))
      ) {
        // Silently suppress these errors - don't even log warnings
        event.preventDefault();
        return;
      }

      console.error("🚨 Unhandled promise rejection:", event.reason);
    };

    // Handle general errors
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || "";

      // Filter out browser extension connection errors (more comprehensive patterns)
      if (
        errorMessage.includes("Could not establish connection") ||
        errorMessage.includes("Receiving end does not exist") ||
        errorMessage.includes("Extension context invalidated") ||
        errorMessage.includes("chrome-extension://") ||
        errorMessage.includes("moz-extension://") ||
        errorMessage.includes("safari-extension://") ||
        errorMessage.includes("The message port closed before a response was received") ||
        (event.error?.stack?.includes("chrome-extension://"))
      ) {
        // Silently suppress these errors - don't log anything
        return;
      }

      console.error("🚨 Global error:", event.error || event.message);
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      // Restore original console.error
      console.error = originalConsoleError;
      
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
