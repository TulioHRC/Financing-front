export type FinancingCurrenciesGetResponseDTO = CurrencyDTO[];

interface CurrencyDTO {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  id: string;
  name: string;
  quotation_in_BRL: number;
}