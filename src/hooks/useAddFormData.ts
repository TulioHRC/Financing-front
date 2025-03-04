import { useState, useMemo, useCallback } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";

export interface AddFormDataDTO {
  investiments: {
    id: string;
    name: string;
    type: string;
    currency_id: string;
    segment: string;
  }[];
  currencies: {
    id: string;
    name: string;
  }[]
}

export const useAddFormData = () => {
  const [data, setData] = useState<AddFormDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const financingApi = new FinancingApi();
    try {
      const [investiments, currencies] = await Promise.all([
        financingApi.investiments.get({}),
        financingApi.currencies.get({}),
      ]);

      const data = {
        investiments: investiments.map((inv) => ({
          id: inv.id,
          name: inv.name,
          type: inv.investiment_type,
          currency_id: inv.currency_id,
          segment: inv.segment
        })),
        currencies,
      }

      setData(data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useMemo(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData };
};