import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingInvestimentsGetResponseDTO } from './dto/financing-investiments.get.response.dto';
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
      settings?: RetrySettings;
    }
  ): Promise<FinancingInvestimentsPostResponseDTO> {
    return (await this.client.post<FinancingInvestimentsPostBodyDTO, FinancingInvestimentsPostResponseDTO>(
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
  ): Promise<FinancingInvestimentsGetResponseDTO> {
    return (await this.client.get<FinancingInvestimentsGetResponseDTO>(
      ``,
      {},
      {
        settings: request.settings,
      }
    )).data;
  }
}