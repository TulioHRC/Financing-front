import { FinancingCurrenciesPostResponseDTO } from "../../services/financing-server/currencies/dto/financing-currencies.post.response.dto";
import { FinancingCurrenciesPutByIdBodyDTO } from "../../services/financing-server/currencies/dto/financing-currencies.putById.body.dto";
import { FinancingApi } from "../../services/financing-server/financing-api"

export async function updateCurrencyById(id: string, data: FinancingCurrenciesPutByIdBodyDTO): Promise<FinancingCurrenciesPostResponseDTO> {
  const apiInstance = new FinancingApi();

  const res = await apiInstance.currencies.putById({
    id: id,
    body: data
  });

  return res;
}
