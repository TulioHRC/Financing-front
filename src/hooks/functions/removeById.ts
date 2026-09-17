import { FinancingCurrenciesOperationsDeleteResponseDTO } from "../../services/financing-server/currencies-operations/dto/financing-currencies-operations.delete.response.dto";
import { FinancingCurrenciesDeleteResponseDTO } from "../../services/financing-server/currencies/dto/financing-currencies.delete.response.dto";
import { FinancingDividendsDeleteResponseDTO } from "../../services/financing-server/dividends/dto/financing-dividends.delete.response.dto";
import { financingApi } from "../../services/financing-server/financing-api"
import { FinancingOperationsDeleteResponseDTO } from "../../services/financing-server/operations/dto/financing-operations.delete.response.dto";

export async function removeCurrencyById(id: string): Promise<FinancingCurrenciesDeleteResponseDTO> {
  return await financingApi.currencies.deleteById({
    id: id
  });
}

export async function removeCurrencyOperationsById(id: string): Promise<FinancingCurrenciesOperationsDeleteResponseDTO> {
  return await financingApi.currenciesOperations.deleteById({
    id: id
  });
}

export async function removeInvestimentsOperationsById(id: string): Promise<FinancingOperationsDeleteResponseDTO> {
  return await financingApi.operations.deleteById({
    id: id
  });
}

export async function removeDividendById(id: string): Promise<FinancingDividendsDeleteResponseDTO> {
  return await financingApi.dividends.deleteById({
    id: id
  });
}