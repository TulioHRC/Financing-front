import { AnalysisCategory } from '../analysis-category';
import { AssetVerdict } from '../asset-verdict';
import { AssetAnalysisIndicatorInputDTO } from './asset-analysis-indicator.dto';

export interface FinancingAssetAnalysesPostBodyDTO {
  watchlist_asset_id: string;
  date: Date;
  observations?: string;
  verdict?: AssetVerdict;
  categories: {
    category: AnalysisCategory;
    score: number;
    comment: string;
    indicators?: AssetAnalysisIndicatorInputDTO[];
  }[];
}
