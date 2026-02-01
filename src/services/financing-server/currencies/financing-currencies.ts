import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingCurrenciesDeleteResponseDTO } from './dto/financing-currencies.delete.response.dto';
import { FinancingCurrenciesGetResponseDTO } from './dto/financing-currencies.get.response.dto';
import { FinancingCurrenciesPostBodyDTO } from './dto/financing-currencies.post.body.dto';
import { FinancingCurrenciesPostResponseDTO } from './dto/financing-currencies.post.response.dto';
import { FinancingCurrenciesPutByIdBodyDTO } from './dto/financing-currencies.putById.body.dto';

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

  async deleteById(
    request: {
      id: string;
      settings?: RetrySettings;
    }
  ): Promise<FinancingCurrenciesDeleteResponseDTO> {
    return (await this.client.delete<FinancingCurrenciesDeleteResponseDTO>(
      `${request.id}`,
      {
        settings: request.settings,
      }
    )).data;
  }

  async putById(
    request: {
      id: string;
      body: FinancingCurrenciesPutByIdBodyDTO;
      settings?: RetrySettings;
    }
  ): Promise<FinancingCurrenciesPostResponseDTO> {
    return (await this.client.put<FinancingCurrenciesPutByIdBodyDTO, FinancingCurrenciesPostResponseDTO>(
      `${request.id}`,
      request.body,
      {
        settings: request.settings,
      }
    )).data;
  }
}