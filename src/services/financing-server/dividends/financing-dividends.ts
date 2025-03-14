import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingDividendsDeleteResponseDTO } from './dto/financing-dividends.delete.response.dto';
import { FinancingDividendsGetResponseDTO } from './dto/financing-dividends.get.response.dto';
import { FinancingDividendsPostBodyDTO } from './dto/financing-dividends.post.body.dto';
import { FinancingDividendsPostResponseDTO } from './dto/financing-dividends.post.response.dto';

export class FinancingDividendsService {
  private readonly client: ApiInstance;
  
  constructor(client: ApiInstance) {
    this.client = new ApiInstance(`${client.getClientBaseUrl()}/dividends`, client.getClientTimeout());
  }

  async get(
    request: {
      settings?: RetrySettings;
    }
  ): Promise<FinancingDividendsGetResponseDTO> {
    return (await this.client.get<FinancingDividendsGetResponseDTO>(
      ``,
      {},
      {
        settings: request.settings,
      }
    )).data;
  }

  async post(
    request: {
      body: FinancingDividendsPostBodyDTO;
      settings?: RetrySettings;
    }
  ): Promise<FinancingDividendsPostResponseDTO> {
    return (await this.client.post<FinancingDividendsPostBodyDTO, FinancingDividendsPostResponseDTO>(
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
  ): Promise<FinancingDividendsDeleteResponseDTO> {
    return (await this.client.delete<FinancingDividendsDeleteResponseDTO>(
      `${request.id}`,
      {
        settings: request.settings,
      }
    )).data;
  }
}