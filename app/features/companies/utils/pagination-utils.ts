/**
 * Pagination utility functions
 */

/**
 * Calculate total count based on pages and items per page
 */
export function calculateTotalCount(
  totalPages: number,
  itemsPerPage: number
): number {
  return totalPages * itemsPerPage;
}

/**
 * Generate mobile pagination pages array
 */
export function generateMobilePaginationPages(totalPages: number): number[] {
  const pages: number[] = [];

  // Always show page 1
  pages.push(1);

  // Show page 2 if totalPages > 1
  if (totalPages > 1) {
    pages.push(2);
  }

  // Show ellipsis and last page if there are more than 2 pages
  if (totalPages > 2) {
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Check if pagination should be shown
 */
export function shouldShowPagination(
  totalPages: number,
  isLoading: boolean
): boolean {
  return totalPages > 1 || isLoading;
}

/**
 * Generate aria label for pagination button
 */
export function generatePaginationAriaLabel(
  action: "previous" | "next" | "page",
  pageNumber?: number,
  currentPage?: number
): string {
  switch (action) {
    case "previous":
      return `Go to previous page${
        currentPage && currentPage > 1 ? ` (page ${currentPage - 1})` : ""
      }`;
    case "next":
      return `Go to next page${
        currentPage && currentPage < (pageNumber || 0)
          ? ` (page ${currentPage + 1})`
          : ""
      }`;
    case "page":
      return `Go to page ${pageNumber}`;
    default:
      return "";
  }
}
