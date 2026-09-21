import { useState, useEffect, useCallback } from "react";
import { financingApi } from "../services/financing-server/financing-api";
import { FinancingInvestimentsCurrencyExposureResponseDTO } from "../services/financing-server/investiments/dto/financing-investiments.currency-exposure.response.dto";

export type CurrencyExposureDataDTO = FinancingInvestimentsCurrencyExposureResponseDTO;

export const useCurrencyExposure = () => {
  const [data, setData] = useState<CurrencyExposureDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const exposure = await financingApi.investiments.getCurrencyExposure();
      setData(exposure);
    } catch (error) {
      console.error("Failed to fetch currency exposure", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData };
};
