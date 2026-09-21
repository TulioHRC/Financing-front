import { useState, useEffect, useCallback } from "react";
import { financingApi } from "../services/financing-server/financing-api";
import { WatchlistAssetDTO } from "../services/financing-server/watchlist-assets/dto/financing-watchlist-assets.get.response.dto";
import { WatchlistAssetAnalysisDTO } from "../services/financing-server/watchlist-assets/dto/financing-watchlist-assets.analyses.response.dto";

export interface WatchlistAssetDetailDataDTO {
  asset: WatchlistAssetDTO;
  analyses: WatchlistAssetAnalysisDTO[];
}

export const useWatchlistAssetDetail = (id: string) => {
  const [data, setData] = useState<WatchlistAssetDetailDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [asset, analyses] = await Promise.all([
        financingApi.watchlistAssets.getById({ id }),
        financingApi.watchlistAssets.getAnalyses({ id }),
      ]);

      setData({ asset, analyses });
    } catch (error) {
      console.error("Failed to fetch watchlist asset detail", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData };
};
