export type FinancingDividendsSummaryResponseDTO = FinancingDividendsSummaryItemDTO[];

export interface FinancingDividendsSummaryItemDTO {
  investiment_id: string;
  investiment_name: string;
  total_value: number;
  total_value_after_fees: number;
  payments_count: number;
}
