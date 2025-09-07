/**
 * Utility functions for company-related operations
 */

/**
 * Get color palette for growth stage badges
 */
export function getGrowthStageColor(stage: string | null): string {
  switch (stage?.toLowerCase()) {
    case "early":
      return "green";
    case "seed":
      return "yellow";
    case "growing":
      return "blue";
    case "late":
      return "purple";
    case "exit":
      return "red";
    default:
      return "gray";
  }
}

/**
 * Get color palette for customer focus badges
 */
export function getCustomerFocusColor(focus: string | null): string {
  switch (focus?.toLowerCase()) {
    case "b2b":
      return "blue";
    case "b2c":
      return "pink";
    case "b2b_b2c":
      return "teal";
    case "b2c_b2b":
      return "orange";
    default:
      return "gray";
  }
}

/**
 * Format funding amount for display
 */
export function formatFundingAmount(amount: number | null): string {
  if (!amount) return "N/A";

  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/**
 * Format funding type for display
 */
export function formatFundingType(type: string | null): string {
  if (!type) return "N/A";
  return type.replace(/_/g, " ").toUpperCase();
}

/**
 * Format date for display
 */
export function formatDate(date: Date | null | string): string {
  if (!date) return "N/A";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get background color for position-based highlighting
 */
export function getPositionBackground(
  position: number,
  currentPage: number
): string {
  if (currentPage !== 1) return "white";
  switch (position) {
    case 1:
      return "yellow.100";
    case 2:
      return "gray.100";
    case 3:
      return "orange.100";
    default:
      return "white";
  }
}

/**
 * Get border color for position-based highlighting
 */
export function getPositionBorderColor(
  position: number,
  currentPage: number
): string {
  if (currentPage !== 1) return "gray.200";
  switch (position) {
    case 1:
      return "yellow.300";
    case 2:
      return "gray.300";
    case 3:
      return "orange.300";
    default:
      return "gray.200";
  }
}

/**
 * Get border color for table row highlighting
 */
export function getTableRowBorderColor(
  position: number,
  currentPage: number
): string {
  if (currentPage !== 1) return "transparent";
  switch (position) {
    case 1:
      return "yellow.300";
    case 2:
      return "gray.300";
    case 3:
      return "orange.300";
    default:
      return "transparent";
  }
}

/**
 * Check if a position should be highlighted (top 3 on first page)
 */
export function isTopThreePosition(
  position: number,
  currentPage: number
): boolean {
  return position <= 3 && currentPage === 1;
}
