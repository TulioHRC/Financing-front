import { FinancingOperationsResponseDTO } from "../services/financing-server/operations/dto/financing-operations.get.response.dto";

function getQuantity(investiment_id: string, operations: FinancingOperationsResponseDTO): number {
  return operations
    .filter(op => op.investiment_id === investiment_id)
    .reduce((acc, op) => acc + op.quantity, 0);
}

export function getInvestimentOperations(
  investiment_id: string,
  operations: FinancingOperationsResponseDTO
): {
    quantity: number,
    averagePrice: number,
} {
  return {
    quantity: getQuantity(investiment_id, operations),
    averagePrice: operations
      .filter(op => op.investiment_id === investiment_id)
      .reduce((acc, op) => acc + op.price * op.quantity, 0) / getQuantity(investiment_id, operations),
  };
}