import { useState, useEffect, useCallback } from "react";
import { financingApi } from "../services/financing-server/financing-api";
import { FinancingWatchlistAssetsComparisonResponseDTO } from "../services/financing-server/watchlist-assets/dto/financing-watchlist-assets.comparison.response.dto";

export type WatchlistComparisonDataDTO = FinancingWatchlistAssetsComparisonResponseDTO;

export const useWatchlistComparison = () => {
  const [data, setData] = useState<WatchlistComparisonDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const comparison = await financingApi.watchlistAssets.getComparison();
      setData(comparison);
    } catch (error) {
      console.error("Failed to fetch watchlist comparison", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData };
};
