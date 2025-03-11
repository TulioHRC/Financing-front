import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingOperationsDeleteResponseDTO } from './dto/financing-operations.delete.response.dto';
import { FinancingOperationsResponseDTO } from './dto/financing-operations.get.response.dto';
import { FinancingOperationsPostBodyDTO } from './dto/financing-operations.post.body.dto';
import { FinancingOperationsPostResponseDTO } from './dto/financing-operations.post.response.dto';

export class FinancingOperationsService {
  private readonly client: ApiInstance;
  
  constructor(client: ApiInstance) {
    this.client = new ApiInstance(`${client.getClientBaseUrl()}/operations`, client.getClientTimeout());
  }

  async post(
    request: {
      body: FinancingOperationsPostBodyDTO;
      settings?: RetrySettings;
    }
  ): Promise<FinancingOperationsPostResponseDTO> {
    return (await this.client.post<FinancingOperationsPostBodyDTO, FinancingOperationsPostResponseDTO>(
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
  ): Promise<FinancingOperationsResponseDTO> {
    return (await this.client.get<FinancingOperationsResponseDTO>(
      ``,
      {},
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
  ): Promise<FinancingOperationsDeleteResponseDTO> {
    return (await this.client.delete<FinancingOperationsDeleteResponseDTO>(
      `${request.id}`,
      {
        settings: request.settings,
      }
    )).data;
  }
}