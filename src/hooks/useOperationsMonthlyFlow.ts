import { useState, useEffect, useCallback } from "react";
import { financingApi } from "../services/financing-server/financing-api";
import { FinancingOperationsMonthlyFlowResponseDTO } from "../services/financing-server/operations/dto/financing-operations.monthly-flow.response.dto";

export type OperationsMonthlyFlowDataDTO = FinancingOperationsMonthlyFlowResponseDTO;

export const useOperationsMonthlyFlow = () => {
  const [data, setData] = useState<OperationsMonthlyFlowDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const flow = await financingApi.operations.getMonthlyFlow();
      setData(flow);
    } catch (error) {
      console.error("Failed to fetch operations monthly flow", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData };
};
