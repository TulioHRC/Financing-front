import { useState, useEffect, useCallback } from "react";
import { financingApi } from "../services/financing-server/financing-api";
import { FinancingDividendsSummaryResponseDTO } from "../services/financing-server/dividends/dto/financing-dividends.summary.response.dto";

export type DividendsSummaryDataDTO = FinancingDividendsSummaryResponseDTO;

export const useDividendsSummary = () => {
  const [data, setData] = useState<DividendsSummaryDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const summary = await financingApi.dividends.getSummary();
      setData(summary);
    } catch (error) {
      console.error("Failed to fetch dividends summary", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData };
};
