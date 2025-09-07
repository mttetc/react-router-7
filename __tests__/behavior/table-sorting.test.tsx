import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { OnUrlUpdateFunction } from "nuqs/adapters/testing";
import { CompanyTable } from "@/features/companies/components/company-table";
import { createCombinedWrapper } from "../utils/combined-wrapper";
import type { Company } from "@/features/companies/types/schemas";

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Alpha Company",
    domain: "alpha.com",
    description: "First company",
    growth_stage: "early",
    customer_focus: "B2B",
    last_funding_type: "Series A",
    last_funding_amount: 1000000,
    rank: 1,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Beta Company",
    domain: "beta.com",
    description: "Second company",
    growth_stage: "seed",
    customer_focus: "B2C",
    last_funding_type: "Angel",
    last_funding_amount: 500000,
    rank: 2,
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    name: "Gamma Company",
    domain: "gamma.com",
    description: "Third company",
    growth_stage: "growing",
    customer_focus: "B2B",
    last_funding_type: "Series B",
    last_funding_amount: 2000000,
    rank: 3,
    createdAt: new Date("2024-01-03"),
  },
];

describe("CompanyTable Sorting Behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display sortable headers with proper accessibility", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(
      <CompanyTable
        companies={mockCompanies}
        isLoading={false}
        currentPage={1}
      />,
      {
        wrapper: createCombinedWrapper({
          searchParams: { sortBy: "rank", sortOrder: "asc" },
          onUrlUpdate,
        }),
      }
    );

    // Check sortable headers have button role and proper ARIA attributes
    const rankHeader = screen.getByRole("button", { name: /sort by rank/i });
    expect(rankHeader).toBeInTheDocument();
    expect(rankHeader).toHaveAttribute("tabIndex", "0");
    expect(rankHeader).toHaveAttribute("aria-sort", "ascending");

    const companyHeader = screen.getByRole("button", {
      name: /sort by company/i,
    });
    expect(companyHeader).toBeInTheDocument();
    expect(companyHeader).toHaveAttribute("aria-sort", "none");

    const fundingHeader = screen.getByRole("button", {
      name: /sort by funding/i,
    });
    expect(fundingHeader).toBeInTheDocument();
    expect(fundingHeader).toHaveAttribute("aria-sort", "none");
  });

  it("should handle click sorting correctly", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(
      <CompanyTable
        companies={mockCompanies}
        isLoading={false}
        currentPage={1}
      />,
      {
        wrapper: createCombinedWrapper({
          searchParams: { sortBy: "", sortOrder: "asc" },
          onUrlUpdate,
        }),
      }
    );

    // Click on company header to sort by name
    const companyHeader = screen.getByRole("button", {
      name: /sort by company/i,
    });
    await user.click(companyHeader);

    expect(onUrlUpdate).toHaveBeenCalledOnce();
    const event = onUrlUpdate.mock.calls[0]![0]!;
    expect(event.searchParams.get("sortBy")).toBe("name");
    // sortOrder is null because "asc" is the default value, so nuqs doesn't update the URL
    expect(event.searchParams.get("sortOrder")).toBeNull();
  });

  it("should toggle sort order when clicking same header", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    render(
      <CompanyTable
        companies={mockCompanies}
        isLoading={false}
        currentPage={1}
      />,
      {
        wrapper: createCombinedWrapper({
          searchParams: { sortBy: "rank", sortOrder: "asc" },
          onUrlUpdate,
        }),
      }
    );

    // Click on rank header (currently ascending)
    const rankHeader = screen.getByRole("button", { name: /sort by rank/i });
    await user.click(rankHeader);

    expect(onUrlUpdate).toHaveBeenCalledOnce();
    const event = onUrlUpdate.mock.calls[0]![0]!;
    expect(event.searchParams.get("sortBy")).toBe("rank");
    expect(event.searchParams.get("sortOrder")).toBe("desc");
  });

  it("should handle keyboard navigation for sorting", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(
      <CompanyTable
        companies={mockCompanies}
        isLoading={false}
        currentPage={1}
      />,
      {
        wrapper: createCombinedWrapper({
          searchParams: { sortBy: "rank", sortOrder: "asc" },
          onUrlUpdate,
        }),
      }
    );

    // Focus on rank header
    const rankHeader = screen.getByRole("button", { name: /sort by rank/i });
    rankHeader.focus();

    // Press Enter to sort (should toggle from asc to desc)
    await user.keyboard("{Enter}");
    expect(onUrlUpdate).toHaveBeenCalledOnce();
    let event = onUrlUpdate.mock.calls[0]![0]!;
    expect(event.searchParams.get("sortBy")).toBe("rank");
    expect(event.searchParams.get("sortOrder")).toBe("desc");

    // Clear mocks and test Space key (should toggle from desc to asc)
    onUrlUpdate.mockClear();
    await user.keyboard(" ");
    expect(onUrlUpdate).toHaveBeenCalledOnce();
    event = onUrlUpdate.mock.calls[0]![0]!;
    expect(event.searchParams.get("sortBy")).toBe("rank");
    // sortOrder is null because "asc" is the default value, so nuqs doesn't update the URL
    expect(event.searchParams.get("sortOrder")).toBeNull();
  });

  it("should show correct sort indicators", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(
      <CompanyTable
        companies={mockCompanies}
        isLoading={false}
        currentPage={1}
      />,
      {
        wrapper: createCombinedWrapper({
          searchParams: { sortBy: "name", sortOrder: "desc" },
          onUrlUpdate,
        }),
      }
    );

    const companyHeader = screen.getByRole("button", {
      name: /sort by company/i,
    });
    expect(companyHeader).toHaveAttribute("aria-sort", "descending");

    // Should show descending arrow icon
    const sortIcon = companyHeader.querySelector("svg");
    expect(sortIcon).toBeInTheDocument();
  });

  it("should handle sorting with different data types", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(
      <CompanyTable
        companies={mockCompanies}
        isLoading={false}
        currentPage={1}
      />,
      {
        wrapper: createCombinedWrapper({
          searchParams: { sortBy: "", sortOrder: "asc" },
          onUrlUpdate,
        }),
      }
    );

    // Test sorting by funding amount
    const fundingHeader = screen.getByRole("button", {
      name: /sort by funding/i,
    });
    await user.click(fundingHeader);

    expect(onUrlUpdate).toHaveBeenCalledOnce();
    let event = onUrlUpdate.mock.calls[0]![0]!;
    expect(event.searchParams.get("sortBy")).toBe("funding");
    // sortOrder is null because "asc" is the default value, so nuqs doesn't update the URL
    expect(event.searchParams.get("sortOrder")).toBeNull();

    // Test sorting by creation date
    onUrlUpdate.mockClear();
    const dateHeader = screen.getByRole("button", {
      name: /sort by added/i,
    });
    await user.click(dateHeader);

    expect(onUrlUpdate).toHaveBeenCalledOnce();
    event = onUrlUpdate.mock.calls[0]![0]!;
    expect(event.searchParams.get("sortBy")).toBe("createdAt");
    // sortOrder is null because "asc" is the default value, so nuqs doesn't update the URL
    expect(event.searchParams.get("sortOrder")).toBeNull();
  });

  it("should maintain sort state across re-renders", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const { rerender } = render(
      <CompanyTable
        companies={mockCompanies}
        isLoading={false}
        currentPage={1}
      />,
      {
        wrapper: createCombinedWrapper({
          searchParams: { sortBy: "name", sortOrder: "desc" },
          onUrlUpdate,
        }),
      }
    );

    const companyHeader = screen.getByRole("button", {
      name: /sort by company/i,
    });
    expect(companyHeader).toHaveAttribute("aria-sort", "descending");

    // Re-render with same props
    rerender(
      <CompanyTable
        companies={mockCompanies}
        isLoading={false}
        currentPage={1}
      />
    );

    // Sort state should be maintained
    const companyHeaderAfterRerender = screen.getByRole("button", {
      name: /sort by company/i,
    });
    expect(companyHeaderAfterRerender).toHaveAttribute(
      "aria-sort",
      "descending"
    );
  });

  it("should handle sorting with empty data", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<CompanyTable companies={[]} isLoading={false} currentPage={1} />, {
      wrapper: createCombinedWrapper({
        searchParams: { sortBy: "rank", sortOrder: "asc" },
        onUrlUpdate,
      }),
    });

    // Should show empty state message instead of table
    expect(screen.getByText("No companies found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your filters to see more results")
    ).toBeInTheDocument();
  });

  it("should handle sorting during loading state", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<CompanyTable companies={[]} isLoading={true} currentPage={1} />, {
      wrapper: createCombinedWrapper({
        searchParams: { sortBy: "rank", sortOrder: "asc" },
        onUrlUpdate,
      }),
    });

    // Should show loading skeleton with table headers (not sortable buttons)
    expect(screen.getByText("Rank")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();

    // Should show skeleton rows
    const skeletons = screen.getAllByRole("generic");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should provide proper tooltips for sortable headers", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(
      <CompanyTable
        companies={mockCompanies}
        isLoading={false}
        currentPage={1}
      />,
      {
        wrapper: createCombinedWrapper({
          searchParams: { sortBy: "rank", sortOrder: "asc" },
          onUrlUpdate,
        }),
      }
    );

    const rankHeader = screen.getByRole("button", { name: /sort by rank/i });

    // Hover to show tooltip
    await user.hover(rankHeader);

    // Tooltip should indicate current sort state and next action
    await screen.findByText(/click to sort by rank descending/i);
  });
});
