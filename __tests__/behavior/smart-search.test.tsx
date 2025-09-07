import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { OnUrlUpdateFunction } from "nuqs/adapters/testing";
import { SmartSearch } from "@/features/companies/forms/smart-search";
import { createCombinedWrapper } from "../utils/combined-wrapper";

// Mock currency store
vi.mock("@/stores/currency.store", () => ({
  useCurrencyStore: vi.fn(() => "USD"),
}));

// Mock currency utils
vi.mock("@/utils/currency-utils", () => ({
  convertCurrency: vi.fn((amount) => amount),
  convertToUSD: vi.fn((amount) => amount),
}));

// Mock rooks debounce
vi.mock("rooks", () => ({
  useDebounce: vi.fn((fn) => {
    // Return a function that calls the original function immediately
    return (...args: any[]) => {
      fn(...args);
    };
  }),
}));

describe("SmartSearch Behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render search input with proper accessibility", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<SmartSearch />, {
      wrapper: createCombinedWrapper({
        searchParams: {
          search: "",
          growthStage: null,
          customerFocus: null,
          fundingType: null,
          minRank: null,
          maxRank: null,
          minFunding: null,
          maxFunding: null,
        },
        onUrlUpdate,
      }),
    });

    // Check search input has proper ARIA attributes
    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("type", "text");
    expect(searchInput).toHaveAttribute("placeholder", "Search");
  });

  it("should handle basic text input", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<SmartSearch />, {
      wrapper: createCombinedWrapper({
        searchParams: {
          search: "",
          growthStage: null,
          customerFocus: null,
          fundingType: null,
          minRank: null,
          maxRank: null,
          minFunding: null,
          maxFunding: null,
        },
        onUrlUpdate,
      }),
    });

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "test company");

    expect(searchInput).toHaveValue("test company");
  });

  it("should handle keyboard navigation", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<SmartSearch />, {
      wrapper: createCombinedWrapper({
        searchParams: {
          search: "",
          growthStage: null,
          customerFocus: null,
          fundingType: null,
          minRank: null,
          maxRank: null,
          minFunding: null,
          maxFunding: null,
        },
        onUrlUpdate,
      }),
    });

    const searchInput = screen.getByRole("textbox");

    // Focus on input
    searchInput.focus();
    expect(searchInput).toHaveFocus();

    // Type and use arrow keys
    await user.type(searchInput, "test");
    await user.keyboard("{ArrowLeft}");
    await user.keyboard("{ArrowRight}");

    expect(searchInput).toHaveValue("test");
  });

  it("should handle paste events", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<SmartSearch />, {
      wrapper: createCombinedWrapper({
        searchParams: {
          search: "",
          growthStage: null,
          customerFocus: null,
          fundingType: null,
          minRank: null,
          maxRank: null,
          minFunding: null,
          maxFunding: null,
        },
        onUrlUpdate,
      }),
    });

    const searchInput = screen.getByRole("textbox");

    // Simulate paste
    await user.click(searchInput);
    await user.paste("B2B companies with $5M funding");

    expect(searchInput).toHaveValue("B2B companies with $5M funding");
  });

  it("should handle edge cases in pattern matching", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<SmartSearch />, {
      wrapper: createCombinedWrapper({
        searchParams: {
          search: "",
          growthStage: null,
          customerFocus: null,
          fundingType: null,
          minRank: null,
          maxRank: null,
          minFunding: null,
          maxFunding: null,
        },
        onUrlUpdate,
      }),
    });

    const searchInput = screen.getByRole("textbox");

    // Test edge cases
    await user.type(searchInput, "B2B2C companies"); // Should not match B2B
    await user.type(searchInput, "earlybird companies"); // Should not match early

    // Should not show false positive filters
    expect(screen.queryByText("B2B")).not.toBeInTheDocument();
    expect(screen.queryByText("early Stage")).not.toBeInTheDocument();
  });

  it("should provide helpful description text", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<SmartSearch />, {
      wrapper: createCombinedWrapper({
        searchParams: {
          search: "",
          growthStage: null,
          customerFocus: null,
          fundingType: null,
          minRank: null,
          maxRank: null,
          minFunding: null,
          maxFunding: null,
        },
        onUrlUpdate,
      }),
    });

    expect(
      screen.getByText(
        /search by funding \(1m, \$5m\+\), stage \(seed, series a\), focus \(b2b, b2c\), or rank \(top 100\)\./i
      )
    ).toBeInTheDocument();
  });

  it("should handle focus and blur events", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<SmartSearch />, {
      wrapper: createCombinedWrapper({
        searchParams: {
          search: "",
          growthStage: null,
          customerFocus: null,
          fundingType: null,
          minRank: null,
          maxRank: null,
          minFunding: null,
          maxFunding: null,
        },
        onUrlUpdate,
      }),
    });

    const searchInput = screen.getByRole("textbox");

    // Focus should change styling
    await user.click(searchInput);
    expect(searchInput).toHaveFocus();

    // Blur should maintain state
    await user.tab();
    expect(searchInput).not.toHaveFocus();
  });
});
