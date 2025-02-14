import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingCurrenciesGetResponseDTO } from './dto/financing-currencies.get.response.dto';

export class FinancingCurrenciesService {
  private readonly client: ApiInstance;
  
  constructor(client: ApiInstance) {
    this.client = new ApiInstance(`${client.getClientBaseUrl()}/currency`, client.getClientTimeout());
  }

  async get(
    request: {
      settings?: RetrySettings;
    }
  ): Promise<FinancingCurrenciesGetResponseDTO> {
    return (await this.client.get<FinancingCurrenciesGetResponseDTO>(
      ``,
      {},
      {
        settings: request.settings,
      }
    )).data;
  }
}