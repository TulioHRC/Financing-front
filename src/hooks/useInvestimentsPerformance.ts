import { useState, useEffect, useCallback } from "react";
import { financingApi } from "../services/financing-server/financing-api";
import { FinancingInvestimentsPerformanceResponseDTO } from "../services/financing-server/investiments/dto/financing-investiments.performance.response.dto";

export type InvestimentsPerformanceDataDTO = FinancingInvestimentsPerformanceResponseDTO;

export const useInvestimentsPerformance = () => {
  const [data, setData] = useState<InvestimentsPerformanceDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const performance = await financingApi.investiments.getPerformance();
      setData(performance);
    } catch (error) {
      console.error("Failed to fetch investiments performance", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData };
};
