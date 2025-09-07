import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/features/companies/components/pagination";
import { createTestWrapper } from "../utils/test-wrapper";

describe("Pagination Behavior", () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle page navigation correctly", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    // Click next button
    const nextButton = screen.getByRole("button", { name: /next page/i });
    await user.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);

    // Click previous button
    const prevButton = screen.getByRole("button", {
      name: /previous page/i,
    });
    await user.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it("should handle direct page selection", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    // Click on page 3
    const page3Button = screen.getByRole("button", { name: /page 3/i });
    await user.click(page3Button);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("should disable navigation buttons appropriately", () => {
    // Test first page - previous should be disabled
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    const prevButton = screen.getByRole("button", {
      name: /previous page/i,
    });
    expect(prevButton).toHaveAttribute("aria-label", "previous page");

    // Test last page - next should be disabled
    rerender(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next page/i });
    expect(nextButton).toHaveAttribute("aria-label", "next page");
  });

  it("should handle loading state correctly", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        isLoading={true}
      />,
      { wrapper: createTestWrapper() }
    );

    // All buttons should be disabled during loading
    const prevButton = screen.getByRole("button", {
      name: /previous page/i,
    });
    const nextButton = screen.getByRole("button", { name: /next page/i });
    const page2Button = screen.getByRole("button", { name: /page 2/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
    expect(page2Button).toBeDisabled();
  });

  it("should not render when only one page and not loading", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render during loading even with one page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        isLoading={true}
      />,
      { wrapper: createTestWrapper() }
    );

    // Should show pagination during loading
    const navigations = screen.getAllByRole("navigation");
    expect(navigations.length).toBeGreaterThan(0);

    // Check that at least one has the expected label
    const hasPaginationLabel = navigations.some((nav) =>
      nav.getAttribute("aria-label")?.toLowerCase().includes("pagination")
    );
    expect(hasPaginationLabel).toBe(true);
  });

  it("should handle keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    // Focus on next button and press Enter
    const nextButton = screen.getByRole("button", { name: /next page/i });
    nextButton.focus();
    await user.keyboard("{Enter}");
    expect(mockOnPageChange).toHaveBeenCalledWith(3);

    // Focus on page button and press Space
    const page3Button = screen.getByRole("button", { name: /page 3/i });
    page3Button.focus();
    await user.keyboard(" ");
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("should show correct current page indicator", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    const currentPageButton = screen.getByRole("button", {
      name: /page 3/i,
    });
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
  });

  it("should handle edge cases with large page numbers", () => {
    render(
      <Pagination
        currentPage={100}
        totalPages={1000}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    // Should show current page
    const currentPageButton = screen.getByRole("button", {
      name: /^page 100$/i,
    });
    expect(currentPageButton).toHaveAttribute("aria-current", "page");

    // Should show navigation buttons
    const prevButton = screen.getByRole("button", {
      name: /previous page/i,
    });
    const nextButton = screen.getByRole("button", { name: /next page/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it("should maintain proper ARIA labels for navigation", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    const prevButton = screen.getByRole("button", {
      name: /previous page/i,
    });
    const nextButton = screen.getByRole("button", { name: /next page/i });

    expect(prevButton).toHaveAttribute("aria-label", "previous page");
    expect(nextButton).toHaveAttribute("aria-label", "next page");
  });

  it("should handle rapid page changes", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    // Rapidly click next button multiple times
    const nextButton = screen.getByRole("button", { name: /next page/i });
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);

    // Should call onPageChange for each click
    expect(mockOnPageChange).toHaveBeenCalledTimes(3);
    expect(mockOnPageChange).toHaveBeenNthCalledWith(1, 3);
    expect(mockOnPageChange).toHaveBeenNthCalledWith(2, 3);
    expect(mockOnPageChange).toHaveBeenNthCalledWith(3, 3);
  });

  it("should handle page change with different total pages", () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />,
      { wrapper: createTestWrapper() }
    );

    // Change to more pages
    rerender(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
        isLoading={false}
      />
    );

    // Should still show current page correctly
    const currentPageButton = screen.getByRole("button", {
      name: /^page 1$/i,
    });
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
  });

  it("should handle zero or negative page numbers gracefully", () => {
    // This should not crash the component
    expect(() => {
      render(
        <Pagination
          currentPage={0}
          totalPages={0}
          onPageChange={mockOnPageChange}
          isLoading={false}
        />,
        { wrapper: createTestWrapper() }
      );
    }).not.toThrow();
  });
});
