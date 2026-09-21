export type FinancingWatchlistAssetsDeleteResponseDTO = WatchlistAssetDTO;

interface WatchlistAssetDTO {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id: string;
  name: string;
  asset_type: string;
  segment: string | null;
  description: string | null;
  investiment_id: string | null;
}
