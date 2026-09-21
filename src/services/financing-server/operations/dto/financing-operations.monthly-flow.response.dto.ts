export type FinancingOperationsMonthlyFlowResponseDTO = FinancingOperationsMonthlyFlowItemDTO[];

export interface FinancingOperationsMonthlyFlowItemDTO {
  month: string;
  buy_value_brl: number;
  sell_value_brl: number;
  net_value_brl: number;
}
