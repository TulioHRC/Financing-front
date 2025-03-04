import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingCurrenciesGetResponseDTO } from './dto/financing-currencies.get.response.dto';
import { FinancingCurrenciesPostBodyDTO } from './dto/financing-currencies.post.body.dto';
import { FinancingCurrenciesPostResponseDTO } from './dto/financing-currencies.post.response.dto';

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

  async post(
    request: {
      body: FinancingCurrenciesPostBodyDTO;
      settings?: RetrySettings;
    }
  ): Promise<FinancingCurrenciesPostResponseDTO> {
    return (await this.client.post<FinancingCurrenciesPostBodyDTO, FinancingCurrenciesPostResponseDTO>(
      ``,
      request.body,
      {
        settings: request.settings,
      }
    )).data;
  }
}