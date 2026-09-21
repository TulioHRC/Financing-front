import { ApiInstance } from '../api-instance';
import { FinancingCurrenciesOperationsService } from './currencies-operations/financing-currencies-operations';
import { FinancingCurrenciesService } from './currencies/financing-currencies';
import { FinancingDividendsService } from './dividends/financing-dividends';
import { FinancingInvestimentsService } from './investiments/financing-investiments';
import { FinancingOperationsService } from './operations/financing-operations';
import { FinancingPricesService } from './prices/financing-prices';
import { FinancingWatchlistAssetsService } from './watchlist-assets/financing-watchlist-assets';
import { FinancingAssetAnalysesService } from './asset-analyses/financing-asset-analyses';

export class FinancingApi {
  private client: ApiInstance;

  public investiments: FinancingInvestimentsService;
  public currencies: FinancingCurrenciesService;
  public operations: FinancingOperationsService;
  public prices: FinancingPricesService;
  public currenciesOperations: FinancingCurrenciesOperationsService;
  public dividends: FinancingDividendsService;
  public watchlistAssets: FinancingWatchlistAssetsService;
  public assetAnalyses: FinancingAssetAnalysesService;

  constructor(client?: ApiInstance) {
    // Always ending the FINANCING_BASE_URL with '/'
    this.client = client || new ApiInstance(import.meta.env.VITE_FINANCING_BASE_URL, 30000);

    this.investiments = new FinancingInvestimentsService(this.client);
    this.currencies = new FinancingCurrenciesService(this.client);
    this.operations = new FinancingOperationsService(this.client);
    this.prices = new FinancingPricesService(this.client);
    this.currenciesOperations = new FinancingCurrenciesOperationsService(this.client);
    this.dividends = new FinancingDividendsService(this.client);
    this.watchlistAssets = new FinancingWatchlistAssetsService(this.client);
    this.assetAnalyses = new FinancingAssetAnalysesService(this.client);
  }
}

export const financingApi = new FinancingApi();