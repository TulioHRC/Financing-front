export type FinancingAssetAnalysesDeleteResponseDTO = AssetAnalysisDTO;

interface AssetAnalysisDTO {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id: string;
  watchlist_asset_id: string;
  date: string;
  observations: string | null;
}
