import { AnalysisCategory } from '../../asset-analyses/analysis-category';
import { AssetVerdict } from '../../asset-analyses/asset-verdict';
import { AssetAnalysisIndicatorDTO } from '../../asset-analyses/dto/asset-analysis-indicator.dto';

export type FinancingWatchlistAssetsAnalysesResponseDTO = WatchlistAssetAnalysisDTO[];

export interface WatchlistAssetAnalysisDTO {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id: string;
  watchlist_asset_id: string;
  date: string;
  observations: string | null;
  verdict: AssetVerdict | null;
  categories: {
    id: string;
    category: AnalysisCategory;
    score: number;
    comment: string;
    indicators: AssetAnalysisIndicatorDTO[];
  }[];
}
