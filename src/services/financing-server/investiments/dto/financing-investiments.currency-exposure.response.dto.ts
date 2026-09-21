export type FinancingInvestimentsCurrencyExposureResponseDTO = FinancingInvestimentsCurrencyExposureItemDTO[];

export interface FinancingInvestimentsCurrencyExposureItemDTO {
  currency_id: string;
  currency_name: string;
  total_value_brl: number;
  holdings_count: number;
  percentage: number;
}
