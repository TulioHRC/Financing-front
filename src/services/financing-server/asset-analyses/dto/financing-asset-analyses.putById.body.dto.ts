import { AnalysisCategory } from '../analysis-category';
import { AssetVerdict } from '../asset-verdict';
import { AssetAnalysisIndicatorInputDTO } from './asset-analysis-indicator.dto';

export interface FinancingAssetAnalysesPutByIdBodyDTO {
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
