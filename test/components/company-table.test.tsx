import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  withNuqsTestingAdapter,
  type OnUrlUpdateFunction,
} from "nuqs/adapters/testing";
import { CompanyTable } from "@/features/companies/components/company-table";
import { createTestWrapper } from "../utils/test-wrapper";
import type { Company } from "@/types/companies";

// Create a combined wrapper that includes both ChakraProvider and nuqs testing adapter
const createCombinedWrapper = (nuqsConfig: {
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

describe("CompanyTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render companies data", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<CompanyTable companies={mockCompanies} isLoading={false} />, {
      wrapper: createCombinedWrapper({
        searchParams: { sortBy: "rank", sortOrder: "asc" },
        onUrlUpdate,
      }),
    });

    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("Another Company")).toBeInTheDocument();
    expect(screen.getByText("test.com")).toBeInTheDocument();
    expect(screen.getByText("another.com")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<CompanyTable companies={[]} isLoading={true} />, {
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

  it("should show empty state", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<CompanyTable companies={[]} isLoading={false} />, {
      wrapper: createCombinedWrapper({
        searchParams: { sortBy: "rank", sortOrder: "asc" },
        onUrlUpdate,
      }),
    });

    expect(screen.getByText("No companies found")).toBeInTheDocument();
  });

  it("should render company details correctly", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<CompanyTable companies={[mockCompanies[0]]} isLoading={false} />, {
      wrapper: createCombinedWrapper({
        searchParams: { sortBy: "rank", sortOrder: "asc" },
        onUrlUpdate,
      }),
    });

    // Check rank badge
    expect(screen.getByText("#1")).toBeInTheDocument();

    // Check company name
    expect(screen.getByText("Test Company")).toBeInTheDocument();

    // Check domain link
    const domainLink = screen.getByText("test.com");
    expect(domainLink).toHaveAttribute("href", "https://test.com");
    expect(domainLink).toHaveAttribute("target", "_blank");

    // Check description
    expect(screen.getByText("A test company description")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<CompanyTable companies={mockCompanies} isLoading={false} />, {
      wrapper: createCombinedWrapper({
        searchParams: { sortBy: "rank", sortOrder: "asc" },
        onUrlUpdate,
      }),
    });

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
});
