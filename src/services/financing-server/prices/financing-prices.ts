import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingPricesResponseDTO } from './dto/financing-prices.get.response.dto';
import { FinancingPricesPostBodyDTO } from './dto/financing-prices.post.body.dto';
import { FinancingPricesPostResponseDTO } from './dto/financing-prices.post.response.dto';

export class FinancingPricesService {
  private readonly client: ApiInstance;
  
  constructor(client: ApiInstance) {
    this.client = new ApiInstance(`${client.getClientBaseUrl()}/prices`, client.getClientTimeout());
  }

  async post(
    request: {
      body: FinancingPricesPostBodyDTO;
      settings?: RetrySettings;
    }
  ): Promise<FinancingPricesPostResponseDTO> {
    return (await this.client.post<FinancingPricesPostBodyDTO, FinancingPricesPostResponseDTO>(
      ``,
      request.body,
      {
        settings: request.settings,
      }
    )).data;
  }

  async get(
    request: {
      settings?: RetrySettings;
    }
  ): Promise<FinancingPricesResponseDTO> {
    return (await this.client.get<FinancingPricesResponseDTO>(
      ``,
      {},
      {
        settings: request.settings,
      }
    )).data;
  }
}