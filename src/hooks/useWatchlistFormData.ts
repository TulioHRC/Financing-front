import { useState, useEffect, useCallback } from "react";
import { financingApi } from "../services/financing-server/financing-api";

export interface WatchlistFormDataDTO {
  investiments: {
    id: string;
    name: string;
    asset_type: string;
    segment: string;
  }[];
  watchlistAssets: {
    id: string;
    name: string;
    asset_type: string;
    segment: string | null;
    description: string | null;
    investiment_id: string | null;
  }[];
  assetTypes: string[];
}

export const useWatchlistFormData = () => {
  const [data, setData] = useState<WatchlistFormDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [investiments, watchlistAssets] = await Promise.all([
        financingApi.investiments.get({}),
        financingApi.watchlistAssets.get({}),
      ]);

      const assetTypes = [
        ...new Set([
          ...investiments.map((inv) => inv.investiment_type),
          ...watchlistAssets.map((a) => a.asset_type),
        ]),
      ].sort();

      setData({
        investiments: investiments.map((inv) => ({
          id: inv.id,
          name: inv.name,
          asset_type: inv.investiment_type,
          segment: inv.segment,
        })),
        watchlistAssets: watchlistAssets.map((a) => ({
          id: a.id,
          name: a.name,
          asset_type: a.asset_type,
          segment: a.segment,
          description: a.description,
          investiment_id: a.investiment_id,
        })),
        assetTypes,
      });
    } catch (error) {
      console.error("Failed to fetch watchlist form data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData };
};
