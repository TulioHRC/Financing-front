import { useState, useMemo, useCallback } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";

export interface InvestimentOperationsDTO {
  id?: string;
  name: string;
  currency_name: string;
  price: number | null;
  quantity: number | null;
  date: Date | null;
};

export type InvestimentsOperationsDataDTO = InvestimentOperationsDTO[];

export const useInvestimentsOperationsData = () => {
  const [investimentsData, setInvestimentsData] = useState<InvestimentsOperationsDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const financingApi = new FinancingApi();
    try {
      const [currencies, investiments, operations] = await Promise.all([
        financingApi.currencies.get({}),
        financingApi.investiments.get({}),
        financingApi.operations.get({})
      ]);

      const data : InvestimentsOperationsDataDTO = [];

      const investiments_by_id : {[key: string]: {name: string, currency_name: string}} = {};

      investiments.forEach(investiment => {
        const investimentData = {
          name: investiment.name,
          currency_name: currencies.find(c => c.id === investiment.currency_id)?.name ?? '-',
        }

        investiments_by_id[investiment.id] = investimentData;
      });

      operations.forEach(operation => {
        const investimentData = investiments_by_id[operation.investiment_id];

        if (investimentData) {
          const date = new Date(operation.date);
          const investmentsOperation : InvestimentOperationsDTO = {
            id: operation.id,
            name: investimentData.name,
            currency_name: investimentData.currency_name,
            price: operation.price,
            quantity: operation.quantity,
            date,
          };

          data.push(investmentsOperation);
        }
      });

      setInvestimentsData(data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useMemo(() => {
    fetchData();
  }, [fetchData]);

  return { investimentsData, isLoading, refetch: fetchData };
};
