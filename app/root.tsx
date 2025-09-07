import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Provider } from "./components/ui/provider";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Use ChakraProvider with default theme for now

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        suppressHydrationWarning
        style={{ height: "100dvh", margin: 0, padding: 0 }}
      >
        <Provider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </Provider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  let errorType = "Unknown";
  let componentStack = "";
  let additionalInfo = "";

  // Enhanced error information
  if (isRouteErrorResponse(error)) {
    message =
      error.status === 404 ? "404 - Page Not Found" : `HTTP ${error.status}`;
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
    errorType = "HTTP Error";
  } else if (error && error instanceof Error) {
    message = error.name || "Application Error";
    details = error.message;
    stack = error.stack;
    errorType = "JavaScript Error";

    // Check for specific error types
    if (error.message.includes("ChakraProvider")) {
      additionalInfo = `
🔧 ChakraProvider Error Detected:
This error usually occurs when:
1. A Chakra UI component is used outside of ChakraProvider
2. Multiple ChakraProviders are nested incorrectly
3. The provider context is lost during rendering

Common solutions:
- Ensure all Chakra UI components are wrapped in ChakraProvider
- Check for Portal components that might render outside the provider
- Verify the provider is at the root level of your app
`;
    } else if (error.message.includes("useContext")) {
      additionalInfo = `
🔧 Context Error Detected:
This error occurs when a component tries to use a React context that is undefined.

Common causes:
- Component is rendered outside of the required provider
- Provider is not properly set up
- Context is being used before it's initialized
`;
    } else if (error.message.includes("nuqs")) {
      additionalInfo = `
🔧 Nuqs Error Detected:
This error is related to URL state management.

Common causes:
- useQueryState used outside of NuqsProvider
- Invalid parser configuration
- URL parameter conflicts
`;
    }
  }

  // Get component stack if available
  if (error && typeof error === "object" && "componentStack" in error) {
    componentStack = (error as any).componentStack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto max-w-4xl">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-red-800 mb-4">{message}</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-red-700 mb-2">
              Error Details:
            </h2>
            <p className="text-red-600 bg-red-100 p-3 rounded border-l-4 border-red-400">
              {details}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-red-700 mb-2">
              Error Type:
            </h2>
            <span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {errorType}
            </span>
          </div>

          {additionalInfo && (
            <div>
              <h2 className="text-lg font-semibold text-red-700 mb-2">
                Troubleshooting:
              </h2>
              <pre className="text-sm text-red-600 bg-red-100 p-3 rounded border-l-4 border-red-400 whitespace-pre-wrap">
                {additionalInfo}
              </pre>
            </div>
          )}

          {stack && (
            <div>
              <h2 className="text-lg font-semibold text-red-700 mb-2">
                Stack Trace:
              </h2>
              <pre className="text-xs text-red-600 bg-red-100 p-3 rounded border-l-4 border-red-400 overflow-x-auto">
                <code>{stack}</code>
              </pre>
            </div>
          )}

          {componentStack && (
            <div>
              <h2 className="text-lg font-semibold text-red-700 mb-2">
                Component Stack:
              </h2>
              <pre className="text-xs text-red-600 bg-red-100 p-3 rounded border-l-4 border-red-400 overflow-x-auto">
                <code>{componentStack}</code>
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Debug Information:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Environment:{" "}
                {import.meta.env.DEV ? "Development" : "Production"}
              </li>
              <li>• Timestamp: {new Date().toISOString()}</li>
              <li>
                • User Agent:{" "}
                {typeof navigator !== "undefined"
                  ? navigator.userAgent
                  : "Server-side"}
              </li>
              <li>
                • URL:{" "}
                {typeof window !== "undefined"
                  ? window.location.href
                  : "Server-side"}
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
