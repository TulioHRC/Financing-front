import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingCurrenciesOperationsGetResponseDTO } from './dto/financing-currencies-operations.get.response.dto';

export class FinancingCurrenciesOperationsService {
  private readonly client: ApiInstance;
  
  constructor(client: ApiInstance) {
    this.client = new ApiInstance(`${client.getClientBaseUrl()}/currency-operations`, client.getClientTimeout());
  }

  async get(
    request: {
      settings?: RetrySettings;
    }
  ): Promise<FinancingCurrenciesOperationsGetResponseDTO> {
    return (await this.client.get<FinancingCurrenciesOperationsGetResponseDTO>(
      ``,
      {},
      {
        settings: request.settings,
      }
    )).data;
  }
}