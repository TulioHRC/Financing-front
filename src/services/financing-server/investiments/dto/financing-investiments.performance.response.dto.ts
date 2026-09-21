export type FinancingInvestimentsPerformanceResponseDTO = FinancingInvestimentsPerformanceItemDTO[];

export interface FinancingInvestimentsPerformanceItemDTO {
  id: string;
  name: string;
  investiment_type: string;
  segment: string;
  quantity: number;
  average_price: number;
  actual_price: number;
  cost_value: number;
  current_value: number;
  gain_value: number;
  roi_percent: number;
}
