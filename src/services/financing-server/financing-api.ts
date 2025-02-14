import { ApiInstance } from '../api-instance';
import { FinancingCurrenciesService } from './currencies/financing-currencies';
import { FinancingInvestimentsService } from './investiments/financing-investiments';
import { FinancingOperationsService } from './operations/financing-operations';

export class FinancingApi {
  private client: ApiInstance;

  public investiments: FinancingInvestimentsService;
  public currencies: FinancingCurrenciesService;
  public operations: FinancingOperationsService;

  constructor(client?: ApiInstance) {
    // Always ending the FINANCING_BASE_URL with '/'
    this.client = client || new ApiInstance(import.meta.env.VITE_FINANCING_BASE_URL, 30000);

    this.investiments = new FinancingInvestimentsService(this.client);
    this.currencies = new FinancingCurrenciesService(this.client);
    this.operations = new FinancingOperationsService(this.client);
  }
}