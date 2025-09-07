import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination } from "@/features/companies/components/pagination";
import { createTestWrapper } from "../utils/test-wrapper";

describe("Pagination Accessibility", () => {
  it("should have proper navigation role and ARIA labels", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={() => {}}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    // Check navigation role - use getAllByRole to handle multiple navigation elements
    const navigations = screen.getAllByRole("navigation");
    expect(navigations.length).toBeGreaterThan(0);

    // Check that at least one has the expected label
    const hasPaginationLabel = navigations.some((nav) =>
      nav.getAttribute("aria-label")?.toLowerCase().includes("pagination")
    );
    expect(hasPaginationLabel).toBe(true);

    // Check previous button - use correct aria-label
    const prevButton = screen.getByRole("button", {
      name: /previous page/i,
    });
    expect(prevButton).toBeInTheDocument();

    // Check next button - use correct aria-label
    const nextButton = screen.getByRole("button", { name: /next page/i });
    expect(nextButton).toBeInTheDocument();

    // Check current page
    const currentPage = screen.getByRole("button", { name: /page 2/i });
    expect(currentPage).toHaveAttribute("aria-current", "page");
  });

  it("should handle first page correctly", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    const prevButton = screen.getByRole("button", {
      name: /previous page/i,
    });
    expect(prevButton).toBeInTheDocument();
  });

  it("should handle last page correctly", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={() => {}}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    const nextButton = screen.getByRole("button", { name: /next page/i });
    expect(nextButton).toBeInTheDocument();
  });

  it("should not render when only one page", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    expect(container.firstChild).toBeNull();
  });
});
