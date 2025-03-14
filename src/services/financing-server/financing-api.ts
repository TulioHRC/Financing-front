import { ApiInstance } from '../api-instance';
import { FinancingCurrenciesOperationsService } from './currencies-operations/financing-currencies-operations';
import { FinancingCurrenciesService } from './currencies/financing-currencies';
import { FinancingDividendsService } from './dividends/financing-dividends';
import { FinancingInvestimentsService } from './investiments/financing-investiments';
import { FinancingOperationsService } from './operations/financing-operations';
import { FinancingPricesService } from './prices/financing-prices';

export class FinancingApi {
  private client: ApiInstance;

  public investiments: FinancingInvestimentsService;
  public currencies: FinancingCurrenciesService;
  public operations: FinancingOperationsService;
  public prices: FinancingPricesService;
  public currenciesOperations: FinancingCurrenciesOperationsService;
  public dividends: FinancingDividendsService;

  constructor(client?: ApiInstance) {
    // Always ending the FINANCING_BASE_URL with '/'
    this.client = client || new ApiInstance(import.meta.env.VITE_FINANCING_BASE_URL, 30000);

    this.investiments = new FinancingInvestimentsService(this.client);
    this.currencies = new FinancingCurrenciesService(this.client);
    this.operations = new FinancingOperationsService(this.client);
    this.prices = new FinancingPricesService(this.client);
    this.currenciesOperations = new FinancingCurrenciesOperationsService(this.client);
    this.dividends = new FinancingDividendsService(this.client);
  }
}