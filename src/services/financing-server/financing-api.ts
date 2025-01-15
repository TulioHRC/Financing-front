import { ApiInstance } from '../api-instance';
import { FinancingInvestimentsService } from './investiments/financing-investiments';

export class FinancingApi {
  private client: ApiInstance;

  public investiments: FinancingInvestimentsService;

  constructor(client?: ApiInstance) {
    // Always ending the FINANCING_BASE_URL with '/'
    this.client = client || new ApiInstance(import.meta.env.VITE_FINANCING_BASE_URL, 30000);

    this.investiments = new FinancingInvestimentsService(this.client);
  }
}