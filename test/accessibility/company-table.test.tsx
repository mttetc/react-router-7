import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { OnUrlUpdateFunction } from "nuqs/adapters/testing";
import { CompanyTable } from "@/features/companies/components/company-table";
import { createCombinedWrapper } from "../utils/combined-wrapper";
import type { Company } from "@/types/companies";

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Test Company",
    domain: "test.com",
    description: "A test company description",
    growth_stage: "early",
    customer_focus: "B2B",
    last_funding_type: "Series A",
    last_funding_amount: 1000000,
    createdAt: new Date(),
    rank: 1,
  },
  {
    id: "2",
    name: "Another Company",
    domain: "another.com",
    description: "Another test company",
    growth_stage: "seed",
    customer_focus: "B2C",
    last_funding_type: "Angel",
    last_funding_amount: 500000,
    rank: 2,
    createdAt: new Date(),
  },
];

describe("CompanyTable Accessibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have proper table structure and ARIA attributes", () => {
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

    // Check table has proper role
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check sortable headers (they have button role)
    expect(
      screen.getByRole("button", { name: /sort by rank/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sort by company/i })
    ).toBeInTheDocument();

    // Check non-sortable column headers
    expect(
      screen.getByRole("columnheader", { name: /description/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /stage/i })
    ).toBeInTheDocument();
  });

  it("should have proper keyboard navigation support", () => {
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

    // Check that sortable headers are focusable
    const rankHeader = screen.getByRole("button", { name: /sort by rank/i });
    expect(rankHeader).toHaveAttribute("tabIndex", "0");

    const companyHeader = screen.getByRole("button", {
      name: /sort by company/i,
    });
    expect(companyHeader).toHaveAttribute("tabIndex", "0");
  });

  it("should have proper ARIA labels for sorting", () => {
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

    // Check sort indicators
    const rankHeader = screen.getByRole("button", { name: /sort by rank/i });
    expect(rankHeader).toHaveAttribute("aria-sort", "ascending");

    const companyHeader = screen.getByRole("button", {
      name: /sort by company/i,
    });
    expect(companyHeader).toHaveAttribute("aria-sort", "none");
  });

  it("should maintain accessibility in loading state", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<CompanyTable companies={[]} isLoading={true} currentPage={1} />, {
      wrapper: createCombinedWrapper({
        searchParams: { sortBy: "rank", sortOrder: "asc" },
        onUrlUpdate,
      }),
    });

    // Should show sortable headers even in loading state
    expect(
      screen.getByRole("button", { name: /sort by rank/i })
    ).toBeInTheDocument();
    // Should show skeleton rows
    const skeletons = screen.getAllByRole("generic");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should maintain accessibility in empty state", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<CompanyTable companies={[]} isLoading={false} currentPage={1} />, {
      wrapper: createCombinedWrapper({
        searchParams: { sortBy: "rank", sortOrder: "asc" },
        onUrlUpdate,
      }),
    });

    expect(screen.getByText("No companies found")).toBeInTheDocument();
  });
});
