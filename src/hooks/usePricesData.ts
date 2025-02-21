import { useState, useMemo } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";

export interface PricesDataDTO {
  investiments: {
    id: string,
    name: string,
    type: string,
    price: number | null,
    currency_id: string
  }[];
};

export const usePricesData = () => {
  const [data, setData] = useState<PricesDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    
  useMemo(() => {
    const fetchData = async () => {
      const financingApi = new FinancingApi();
      try {
        const [investiments, prices] = await Promise.all([
          financingApi.investiments.get({}),
          financingApi.prices.get({})
        ]);

        const pricesObject : { [key: string]: number } = {};
        prices.forEach(p => pricesObject[p.investiment_id] = p.price);

        const data : PricesDataDTO = { investiments: investiments.map(inv => {
          return {
            id: inv.id,
            name: inv.name,
            type: inv.investiment_type,
            price: pricesObject[inv.id] ?? null,
            currency_id: inv.currency_id,
          }
        })};

        setData(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
};
