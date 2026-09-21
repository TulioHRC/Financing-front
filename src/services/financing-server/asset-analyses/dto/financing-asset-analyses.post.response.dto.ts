import { AnalysisCategory } from '../analysis-category';
import { AssetVerdict } from '../asset-verdict';
import { AssetAnalysisIndicatorDTO } from './asset-analysis-indicator.dto';

export type FinancingAssetAnalysesPostResponseDTO = AssetAnalysisDTO;

interface AssetAnalysisDTO {
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
