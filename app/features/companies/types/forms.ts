/**
 * Form types specific to companies feature
 * Company-related form interfaces and types
 */

export interface FilterFormData {
  search?: string;
  growthStage?: string;
  customerFocus?: string;
  fundingType?: string;
  minRank?: string;
  maxRank?: string;
  minFunding?: string;
  maxFunding?: string;
  sortBy?: string;
  sortOrder?: string;
}
