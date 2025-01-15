export type FinancingInvestimentsPostResponseDTO = investimentDTO[]; 

interface investimentDTO {
  created_at: string,
  updated_at: string,
  deleted_at: string | null,
  id: string,
  name: string,
  investiment_type: string,
  segment: string,
  currency_id: string
}