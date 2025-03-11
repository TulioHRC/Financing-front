import { useState, useMemo, useCallback } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";

export interface CurrencyOperationsDTO {
  id?: string;
  price: number | null,
  bought_currency_name: string;
  selled_currency_name: string;
  quantity: number | null;
  date: string;
};

export type CurrenciesOperationsDataDTO = CurrencyOperationsDTO[];

export const useCurrenciesOperationsData = () => {
  const [d, setData] = useState<CurrenciesOperationsDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const financingApi = new FinancingApi();
    try {
      const [currencies, currenciesOperations] = await Promise.all([
        financingApi.currencies.get({}),
        financingApi.currenciesOperations.get({}),
      ]);

      const data : CurrenciesOperationsDataDTO = [];

      currenciesOperations.forEach(co => {
        const boughtCurrency = currencies.find(c => c.id === co.bought_currency_id);
        const selledCurrency = currencies.find(c => c.id === co.selled_currency_id);

        if (boughtCurrency && selledCurrency) {
          data.push({
            id: co.id,
            price: co.price,
            bought_currency_name: boughtCurrency.name,
            selled_currency_name: selledCurrency.name,
            quantity: co.quantity,
            date: co.date,
          });
        }
      });

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

  return { d, isLoading, refetch: fetchData };
};
