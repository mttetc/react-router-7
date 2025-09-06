// Centralized color configuration for all filter types
// This ensures consistency across smart search, quick filters, and active filters

export const FILTER_COLORS = {
  // Growth stages - using green palette for growth/nature theme
  growthStage: {
    early: "green",
    seed: "green", 
    growing: "green",
    late: "green",
    exit: "green",
    default: "green"
  },
  
  // Customer focus - using blue palette for business theme
  customerFocus: {
    b2b: "blue",
    b2c: "blue", 
    b2b_b2c: "blue",
    b2c_b2b: "blue",
    default: "blue"
  },
  
  // Funding amounts - using orange palette for money/value theme
  funding: "orange",
  
  // Funding types - using purple palette for investment theme
  fundingType: "purple",
  
  // Rankings - using yellow palette for achievement theme
  rank: "yellow",
  
  // Search - using gray for neutral search
  search: "gray"
} as const;

// Helper function to get color for a specific filter type and value
export function getFilterColor(
  filterType: keyof typeof FILTER_COLORS,
  value?: string
): string {
  const colorConfig = FILTER_COLORS[filterType];
  
  if (typeof colorConfig === "string") {
    return colorConfig;
  }
  
  if (typeof colorConfig === "object" && value) {
    return (colorConfig as any)[value] || (colorConfig as any).default;
  }
  
  return "gray"; // fallback
}
