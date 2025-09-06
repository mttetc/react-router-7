"use client";

import { useEffect } from "react";

export function GlobalErrorHandler() {
  useEffect(() => {
    // Store original console.error
    const originalConsoleError = console.error;
    
    // Intercept Chrome extension runtime messages to prevent connection errors
    if (typeof window !== 'undefined' && window.chrome?.runtime) {
      const originalSendMessage = window.chrome.runtime.sendMessage;
      if (originalSendMessage) {
        window.chrome.runtime.sendMessage = function(...args: any[]) {
          try {
            return originalSendMessage.apply(this, args);
          } catch (error) {
            // Silently ignore extension connection errors
            return Promise.resolve();
          }
        };
      }
    }
    
    // Also intercept any chrome.tabs.sendMessage if available
    if (typeof window !== 'undefined' && window.chrome?.tabs?.sendMessage) {
      const originalTabsSendMessage = window.chrome.tabs.sendMessage;
      window.chrome.tabs.sendMessage = function(...args: any[]) {
        try {
          return originalTabsSendMessage.apply(this, args);
        } catch (error) {
          // Silently ignore extension connection errors
          return Promise.resolve();
        }
      };
    }
    
    // Override console.error to filter extension errors
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (
        message.includes("Could not establish connection") ||
        message.includes("Receiving end does not exist") ||
        message.includes("Extension context invalidated") ||
        message.includes("chrome-extension://") ||
        message.includes("moz-extension://") ||
        message.includes("safari-extension://") ||
        message.includes("The message port closed before a response was received") ||
        // Additional patterns for React DevTools and other extensions
        message.includes("__REACT_DEVTOOLS_GLOBAL_HOOK__") ||
        message.includes("react-devtools") ||
        message.includes("inject.js") ||
        // Pattern for any extension-related errors
        /extension.*connection/i.test(message) ||
        /connection.*extension/i.test(message)
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
        errorMessage.includes("__REACT_DEVTOOLS_GLOBAL_HOOK__") ||
        errorMessage.includes("react-devtools") ||
        errorMessage.includes("inject.js") ||
        /extension.*connection/i.test(errorMessage) ||
        /connection.*extension/i.test(errorMessage) ||
        (event.reason instanceof Error && 
         (event.reason.stack?.includes("chrome-extension://") ||
          event.reason.stack?.includes("inject.js")))
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
        errorMessage.includes("__REACT_DEVTOOLS_GLOBAL_HOOK__") ||
        errorMessage.includes("react-devtools") ||
        errorMessage.includes("inject.js") ||
        /extension.*connection/i.test(errorMessage) ||
        /connection.*extension/i.test(errorMessage) ||
        (event.error?.stack?.includes("chrome-extension://") ||
         event.error?.stack?.includes("inject.js"))
      ) {
        // Silently suppress these errors - don't log anything
        return;
      }

      console.error("🚨 Global error:", event.error || event.message);
    };

    // Also intercept fetch to prevent extension-related fetch errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        return await originalFetch.apply(window, args);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (
          errorMessage.includes("Could not establish connection") ||
          errorMessage.includes("Receiving end does not exist") ||
          errorMessage.includes("Extension context invalidated") ||
          /extension.*connection/i.test(errorMessage) ||
          /connection.*extension/i.test(errorMessage)
        ) {
          // Return a rejected promise that won't cause console errors
          return Promise.reject(new Error("Extension connection error (suppressed)"));
        }
        throw error;
      }
    };

    // Add a more aggressive error handler that catches everything
    const handleAllErrors = (event: any) => {
      const error = event.error || event.reason || event;
      const message = error?.message || String(error);
      
      if (
        message.includes("Could not establish connection") ||
        message.includes("Receiving end does not exist") ||
        message.includes("Extension context invalidated") ||
        message.includes("chrome-extension://") ||
        message.includes("moz-extension://") ||
        message.includes("safari-extension://") ||
        message.includes("inject.js") ||
        /extension.*connection/i.test(message) ||
        /connection.*extension/i.test(message)
      ) {
        event.preventDefault?.();
        event.stopPropagation?.();
        event.stopImmediatePropagation?.();
        return false;
      }
    };

    // Add multiple event listeners to catch all possible error sources
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleAllErrors, true); // Capture phase
    window.addEventListener("error", handleAllErrors, true); // Capture phase
    document.addEventListener("error", handleAllErrors, true); // Document errors

    return () => {
      // Restore original functions
      console.error = originalConsoleError;
      window.fetch = originalFetch;
      
      // Remove all event listeners
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleAllErrors, true);
      window.removeEventListener("error", handleAllErrors, true);
      document.removeEventListener("error", handleAllErrors, true);
    };
  }, []);

  return null;
}
