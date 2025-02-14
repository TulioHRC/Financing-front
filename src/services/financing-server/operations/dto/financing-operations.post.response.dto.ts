export type FinancingOperationsPostResponseDTO = {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  id: string;
  price: number;
  investiment_id: string;
  quantity: number;
  date: Date;
};