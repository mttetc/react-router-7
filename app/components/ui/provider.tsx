"use client";

import { ChakraProvider, LocaleProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { system } from "../../theme";

export function Provider(props: ColorModeProviderProps) {
  // Always use en-US for SSR to prevent hydration mismatches
  // Client-side components will handle locale detection with ClientOnly wrapper
  const ssrLocale = "en-US";

  return (
    <LocaleProvider locale={ssrLocale}>
      <ChakraProvider value={system}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </LocaleProvider>
  );
}
