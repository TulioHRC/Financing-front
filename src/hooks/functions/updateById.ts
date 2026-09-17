import { FinancingCurrenciesPostResponseDTO } from "../../services/financing-server/currencies/dto/financing-currencies.post.response.dto";
import { FinancingCurrenciesPutByIdBodyDTO } from "../../services/financing-server/currencies/dto/financing-currencies.putById.body.dto";
import { financingApi } from "../../services/financing-server/financing-api"

export async function updateCurrencyById(id: string, data: FinancingCurrenciesPutByIdBodyDTO): Promise<FinancingCurrenciesPostResponseDTO> {
  return await financingApi.currencies.putById({
    id: id,
    body: data
  });
}
