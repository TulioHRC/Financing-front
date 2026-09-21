import { AnalysisCategory } from '../../asset-analyses/analysis-category';
import { AssetVerdict } from '../../asset-analyses/asset-verdict';
import { AssetAnalysisIndicatorDTO } from '../../asset-analyses/dto/asset-analysis-indicator.dto';

export type FinancingWatchlistAssetsComparisonResponseDTO = WatchlistAssetComparisonDTO[];

export interface WatchlistAssetComparisonDTO {
  id: string;
  name: string;
  asset_type: string;
  segment: string | null;
  investiment_id: string | null;
  latest_analysis_id: string | null;
  latest_analysis_date: string | null;
  latest_verdict: AssetVerdict | null;
  average_score: number | null;
  categories: {
    category: AnalysisCategory;
    score: number;
    indicators: Omit<AssetAnalysisIndicatorDTO, "id">[];
  }[];
}
