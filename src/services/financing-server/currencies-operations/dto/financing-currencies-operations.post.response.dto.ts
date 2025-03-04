export type FinancingCurrenciesOperationsPostResponseDTO = CurrencyOperationDTO;

interface CurrencyOperationDTO {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  id: string;
  price: number;
  bought_currency_id: string;
  selled_currency_id: string;
  quantity: number;
  date: string;
}