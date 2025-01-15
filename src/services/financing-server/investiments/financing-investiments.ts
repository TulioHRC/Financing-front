import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingInvestimentsPostBodyDTO } from './dto/financing-investiments.post.body.dto';
import { FinancingInvestimentsPostResponseDTO } from './dto/financing-investiments.post.response.dto';

export class FinancingInvestimentsService {
  private readonly client: ApiInstance;
  
  constructor(client: ApiInstance) {
    this.client = new ApiInstance(`${client.getClientBaseUrl()}/investiments`, client.getClientTimeout());
  }

  async post(
    request: {
      body: FinancingInvestimentsPostBodyDTO;
      bearerToken: string;
      settings?: RetrySettings;
    }
  ): Promise<FinancingInvestimentsPostResponseDTO> {
    return (await this.client.post<FinancingInvestimentsPostBodyDTO, FinancingInvestimentsPostResponseDTO>(
      ``,
      request.body,
      {
        bearerToken: request.bearerToken,
        settings: request.settings,
      }
    )).data;
  }

  async get(
    request: {
      bearerToken: string;
      settings?: RetrySettings;
    }
  ): Promise<FinancingInvestimentsPostResponseDTO> {
    return (await this.client.get<FinancingInvestimentsPostResponseDTO>(
      ``,
      {},
      {
        bearerToken: request.bearerToken,
        settings: request.settings,
      }
    )).data;
  }
}