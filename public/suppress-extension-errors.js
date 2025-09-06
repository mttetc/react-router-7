// Ultimate extension error suppression script
// This runs before React and catches extension errors at the source

(function() {
  'use strict';
  
  // Store original functions
  const originalConsoleError = console.error;
  const originalAddEventListener = window.addEventListener;
  
  // Patterns to match extension errors
  const extensionErrorPatterns = [
    /Could not establish connection/i,
    /Receiving end does not exist/i,
    /Extension context invalidated/i,
    /chrome-extension:\/\//i,
    /moz-extension:\/\//i,
    /safari-extension:\/\//i,
    /inject\.js/i,
    /extension.*connection/i,
    /connection.*extension/i,
    /__REACT_DEVTOOLS_GLOBAL_HOOK__/i,
    /react-devtools/i
  ];
  
  function isExtensionError(message) {
    if (typeof message !== 'string') {
      message = String(message);
    }
    return extensionErrorPatterns.some(pattern => pattern.test(message));
  }
  
  // Override console.error immediately
  console.error = function(...args) {
    const message = args.join(' ');
    if (isExtensionError(message)) {
      return; // Silently ignore
    }
    return originalConsoleError.apply(console, args);
  };
  
  // Override addEventListener to catch errors before they bubble
  window.addEventListener = function(type, listener, options) {
    if (type === 'error' || type === 'unhandledrejection') {
      const wrappedListener = function(event) {
        const error = event.error || event.reason || event;
        const message = error?.message || String(error);
        
        if (isExtensionError(message)) {
          event.preventDefault?.();
          event.stopPropagation?.();
          event.stopImmediatePropagation?.();
          return false;
        }
        
        return listener.call(this, event);
      };
      
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // Intercept Chrome extension APIs if available
  if (window.chrome?.runtime?.sendMessage) {
    const originalSendMessage = window.chrome.runtime.sendMessage;
    window.chrome.runtime.sendMessage = function(...args) {
      try {
        const result = originalSendMessage.apply(this, args);
        if (result && typeof result.catch === 'function') {
          return result.catch(error => {
            if (isExtensionError(error?.message)) {
              return Promise.resolve(); // Silently resolve
            }
            throw error;
          });
        }
        return result;
      } catch (error) {
        if (isExtensionError(error?.message)) {
          return Promise.resolve(); // Silently resolve
        }
        throw error;
      }
    };
  }
  
  // Global error handler as last resort
  window.onerror = function(message, source, lineno, colno, error) {
    if (isExtensionError(message) || isExtensionError(source)) {
      return true; // Prevent default error handling
    }
    return false; // Allow normal error handling
  };
  
  // Global unhandled rejection handler
  window.onunhandledrejection = function(event) {
    const message = event.reason?.message || String(event.reason);
    if (isExtensionError(message)) {
      event.preventDefault();
      return true;
    }
    return false;
  };
  
})();
