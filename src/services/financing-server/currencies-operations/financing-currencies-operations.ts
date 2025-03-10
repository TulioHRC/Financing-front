import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingCurrenciesOperationsDeleteResponseDTO } from './dto/financing-currencies-operations.delete.response.dto';
import { FinancingCurrenciesOperationsGetResponseDTO } from './dto/financing-currencies-operations.get.response.dto';
import { FinancingCurrenciesOperationsPostBodyDTO } from './dto/financing-currencies-operations.post.body.dto';
import { FinancingCurrenciesOperationsPostResponseDTO } from './dto/financing-currencies-operations.post.response.dto';

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

  async post(
    request: {
      body: FinancingCurrenciesOperationsPostBodyDTO;
      settings?: RetrySettings;
    }
  ): Promise<FinancingCurrenciesOperationsPostResponseDTO> {
    return (await this.client.post<FinancingCurrenciesOperationsPostBodyDTO, FinancingCurrenciesOperationsPostResponseDTO>(
      ``,
      request.body,
      {
        settings: request.settings,
      }
    )).data;
  }

  async deleteById(
    request: {
      id: string;
      settings?: RetrySettings;
    }
  ): Promise<FinancingCurrenciesOperationsDeleteResponseDTO> {
    return (await this.client.delete<FinancingCurrenciesOperationsDeleteResponseDTO>(
      `${request.id}`,
      {
        settings: request.settings,
      }
    )).data;
  }
}