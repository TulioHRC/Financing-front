export type FinancingDividendsGetResponseDTO = DividendsDTO[];

interface DividendsDTO {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  id: string;
  investiment_id: string;
  value: number;
  value_after_fees: number;
  date: string;
  investiment_quantity: number;
}