import { FinancingCurrenciesOperationsDeleteResponseDTO } from "../../services/financing-server/currencies-operations/dto/financing-currencies-operations.delete.response.dto";
import { FinancingCurrenciesDeleteResponseDTO } from "../../services/financing-server/currencies/dto/financing-currencies.delete.response.dto";
import { FinancingApi } from "../../services/financing-server/financing-api"
import { FinancingOperationsDeleteResponseDTO } from "../../services/financing-server/operations/dto/financing-operations.delete.response.dto";

export async function removeCurrencyById(id: string): Promise<FinancingCurrenciesDeleteResponseDTO> {
  const apiInstance = new FinancingApi();

  const res = await apiInstance.currencies.deleteById({
    id: id
  });

  return res;
}

export async function removeCurrencyOperationsById(id: string): Promise<FinancingCurrenciesOperationsDeleteResponseDTO> {
  const apiInstance = new FinancingApi();

  const res = await apiInstance.currenciesOperations.deleteById({
    id: id
  });

  return res;
}

export async function removeInvestimentsOperationsById(id: string): Promise<FinancingOperationsDeleteResponseDTO> {
  const apiInstance = new FinancingApi();

  const res = await apiInstance.operations.deleteById({
    id: id
  });

  return res;
}