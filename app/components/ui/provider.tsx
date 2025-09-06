import { ChakraProvider, LocaleProvider } from "@chakra-ui/react";
import { QueryProvider } from "./query-provider";
import { ErrorBoundary } from "./error-boundary";
import { GlobalErrorHandler } from "./error-handler";
import { system } from "../../theme";
import { NuqsProvider } from "./nuqs-provider";

export function Provider(props: { children: React.ReactNode }) {
  // Fixed locale prevents SSR hydration mismatches
  const ssrLocale = "en-US";

  return (
    <ErrorBoundary>
      <GlobalErrorHandler />
      <NuqsProvider>
        <LocaleProvider locale={ssrLocale}>
          <ChakraProvider value={system}>
            <QueryProvider>{props.children}</QueryProvider>
          </ChakraProvider>
        </LocaleProvider>
      </NuqsProvider>
    </ErrorBoundary>
  );
}
