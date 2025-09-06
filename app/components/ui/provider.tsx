import { ChakraProvider, LocaleProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { QueryProvider } from "./query-provider";
import { ErrorBoundary } from "./error-boundary";
import { GlobalErrorHandler } from "./error-handler";
import { system } from "../../theme";
import { NuqsProvider } from "./nuqs-provider";

export function Provider(props: ColorModeProviderProps) {
  // Fixed locale prevents SSR hydration mismatches
  const ssrLocale = "en-US";

  return (
    <ErrorBoundary>
      <GlobalErrorHandler />
      <NuqsProvider>
        <LocaleProvider locale={ssrLocale}>
          <ChakraProvider value={system}>
            <QueryProvider>
              <ColorModeProvider>{props.children}</ColorModeProvider>
            </QueryProvider>
          </ChakraProvider>
        </LocaleProvider>
      </NuqsProvider>
    </ErrorBoundary>
  );
}
