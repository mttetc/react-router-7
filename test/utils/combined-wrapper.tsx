import React from "react";
import {
  withNuqsTestingAdapter,
  type OnUrlUpdateFunction,
} from "nuqs/adapters/testing";
import { createTestWrapper } from "./test-wrapper";

// Create a combined wrapper that includes both ChakraProvider and nuqs testing adapter
export const createCombinedWrapper = (nuqsConfig: {
  searchParams: any;
  onUrlUpdate: OnUrlUpdateFunction;
}) => {
  const TestWrapper = createTestWrapper();
  const NuqsWrapper = withNuqsTestingAdapter(nuqsConfig);

  return ({ children }: { children: React.ReactNode }) => (
    <TestWrapper>
      <NuqsWrapper>{children}</NuqsWrapper>
    </TestWrapper>
  );
};
