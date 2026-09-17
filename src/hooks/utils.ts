import { FinancingOperationsResponseDTO } from "../services/financing-server/operations/dto/financing-operations.get.response.dto";

interface CurrencyQuotationDTO {
  id: string;
  quotation_in_BRL: number | null;
}

/** Advances a "YYYY-MM" key by one month, e.g. "2024-12" -> "2025-01". */
export function nextMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return month === 12
    ? `${year + 1}-01`
    : `${year}-${String(month + 1).padStart(2, '0')}`;
}

/** Quotation to convert an amount from `fromCurrencyId` into `toCurrencyId`, both priced in BRL. */
export function convertQuotation(
  currencies: CurrencyQuotationDTO[],
  toCurrencyId: string,
  fromCurrencyId: string
): number {
  const toQuotation = currencies.find(c => c.id === toCurrencyId)?.quotation_in_BRL ?? 0;
  const fromQuotation = currencies.find(c => c.id === fromCurrencyId)?.quotation_in_BRL ?? 0;

  return toQuotation === 0 ? 0 : fromQuotation / toQuotation;
}

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

export function getOldestInvestimentDate(operations: FinancingOperationsResponseDTO) : Date {
  const oldestDate = operations.reduce((acc, op) => op.date < acc? op.date : acc, operations[0].date);
  return oldestDate;
}