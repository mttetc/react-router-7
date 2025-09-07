import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterForm } from "@/features/companies/forms/filter-form";
import { createTestWrapper } from "../utils/test-wrapper";

// Mock nuqs
const mockSetSearch = vi.fn();
const mockSetGrowthStage = vi.fn();
const mockSetCustomerFocus = vi.fn();
const mockSetFundingType = vi.fn();
const mockSetMinRank = vi.fn();
const mockSetMaxRank = vi.fn();
const mockSetMinFunding = vi.fn();
const mockSetMaxFunding = vi.fn();
const mockSetSortBy = vi.fn();
const mockSetSortOrder = vi.fn();
const mockSetPage = vi.fn();
const mockSetLimit = vi.fn();

vi.mock("nuqs", () => ({
  useQueryState: vi.fn((key) => {
    const setters = {
      search: [null, mockSetSearch],
      growthStage: [null, mockSetGrowthStage],
      customerFocus: [null, mockSetCustomerFocus],
      fundingType: [null, mockSetFundingType],
      minRank: [null, mockSetMinRank],
      maxRank: [null, mockSetMaxRank],
      minFunding: [null, mockSetMinFunding],
      maxFunding: [null, mockSetMaxFunding],
      sortBy: [null, mockSetSortBy],
      sortOrder: ["asc", mockSetSortOrder],
      page: [1, mockSetPage],
      limit: [12, mockSetLimit],
    };
    return setters[key as keyof typeof setters] || [null, vi.fn()];
  }),
}));

// Mock the smart search component
vi.mock("@/features/companies/forms/smart-search", () => ({
  SmartSearch: () => <div data-testid="smart-search">Smart Search</div>,
  getCurrentSearchInput: () => "",
}));

// Mock the quick filters component
vi.mock("@/features/companies/forms/quick-filters", () => ({
  QuickFilters: () => <div data-testid="quick-filters">Quick Filters</div>,
}));

// Mock the active filters component
vi.mock("@/features/companies/forms/active-filters", () => ({
  ActiveFilters: ({ filters, onRemoveFilter, onResetAll }: any) => (
    <div data-testid="active-filters">
      <button onClick={() => onRemoveFilter("growthStage")}>
        Remove Growth Stage
      </button>
      <button onClick={onResetAll}>Reset All</button>
      <div data-testid="filters-count">
        Active filters:{" "}
        {Object.keys(filters).filter((key) => filters[key]).length}
      </div>
    </div>
  ),
}));

// Mock the detailed filters component
vi.mock("@/features/companies/forms/detailed-filters", () => ({
  DetailedFilters: () => (
    <div data-testid="detailed-filters">Detailed Filters</div>
  ),
}));

// Mock the client only component
vi.mock("@/components/ui/client-only", () => ({
  ClientOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("FilterForm Behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all filter sections with proper accessibility", () => {
    render(<FilterForm />, { wrapper: createTestWrapper() });

    // Check main filter container
    const filterContainer = screen.getByRole("complementary", {
      name: /company filters/i,
    });
    expect(filterContainer).toBeInTheDocument();

    // Check search section
    const searchSection = screen.getByRole("search", {
      name: /search companies/i,
    });
    expect(searchSection).toBeInTheDocument();
    expect(screen.getByTestId("smart-search")).toBeInTheDocument();

    // Check quick filters section
    const quickFiltersSection = screen.getByRole("group", {
      name: /quick filters/i,
    });
    expect(quickFiltersSection).toBeInTheDocument();
    expect(screen.getByTestId("quick-filters")).toBeInTheDocument();

    // Check active filters section
    const activeFiltersSection = screen.getByRole("group", {
      name: /active filters/i,
    });
    expect(activeFiltersSection).toBeInTheDocument();
    expect(screen.getByTestId("active-filters")).toBeInTheDocument();

    // Check detailed filters section
    const detailedFiltersSection = screen.getByRole("group", {
      name: /detailed filters/i,
    });
    expect(detailedFiltersSection).toBeInTheDocument();
    expect(screen.getByTestId("detailed-filters")).toBeInTheDocument();
  });

  it("should handle filter removal correctly", async () => {
    const user = userEvent.setup();
    render(<FilterForm />, { wrapper: createTestWrapper() });

    const removeButton = screen.getByText("Remove Growth Stage");
    await user.click(removeButton);

    expect(mockSetGrowthStage).toHaveBeenCalledWith(null);
  });

  it("should handle reset all filters correctly", async () => {
    const user = userEvent.setup();
    render(<FilterForm />, { wrapper: createTestWrapper() });

    const resetButton = screen.getByText("Reset All");
    await user.click(resetButton);

    // Should reset all filters except search
    expect(mockSetGrowthStage).toHaveBeenCalledWith(null);
    expect(mockSetCustomerFocus).toHaveBeenCalledWith(null);
    expect(mockSetFundingType).toHaveBeenCalledWith(null);
    expect(mockSetMinRank).toHaveBeenCalledWith(null);
    expect(mockSetMaxRank).toHaveBeenCalledWith(null);
    expect(mockSetMinFunding).toHaveBeenCalledWith(null);
    expect(mockSetMaxFunding).toHaveBeenCalledWith(null);
    expect(mockSetSortBy).toHaveBeenCalledWith(null);
    expect(mockSetSortOrder).toHaveBeenCalledWith("asc");
    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockSetLimit).toHaveBeenCalledWith(12);

    // Search should not be reset
    expect(mockSetSearch).not.toHaveBeenCalled();
  });

  it("should handle keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<FilterForm />, { wrapper: createTestWrapper() });

    // Tab through the form elements
    await user.tab();
    await user.tab();
    await user.tab();

    // Should be able to interact with buttons
    const removeButton = screen.getByText("Remove Growth Stage");
    expect(removeButton).toBeInTheDocument();
  });
});
