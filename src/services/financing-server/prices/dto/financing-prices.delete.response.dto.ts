export type FinancingPricesDeleteResponseDTO = {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  price: number;
  investiment_id: string;
};