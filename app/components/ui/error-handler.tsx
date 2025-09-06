"use client";

import { useEffect } from "react";

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason);
      
      // Filter out browser extension connection errors
      if (
        errorMessage.includes('Could not establish connection') ||
        errorMessage.includes('Receiving end does not exist') ||
        errorMessage.includes('Extension context invalidated') ||
        errorMessage.includes('chrome-extension://')
      ) {
        console.warn('🔌 Browser extension connection error (suppressed):', errorMessage);
        // Prevent the error from being logged to console as an error
        event.preventDefault();
        return;
      }
      
      console.error('🚨 Unhandled promise rejection:', event.reason);
    };

    // Handle general errors
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || '';
      
      // Filter out browser extension connection errors
      if (
        errorMessage.includes('Could not establish connection') ||
        errorMessage.includes('Receiving end does not exist') ||
        errorMessage.includes('Extension context invalidated') ||
        errorMessage.includes('chrome-extension://')
      ) {
        console.warn('🔌 Browser extension error (suppressed):', errorMessage);
        return;
      }
      
      console.error('🚨 Global error:', event.error || event.message);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
