import { useState, useMemo } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";
import { getInvestimentOperations } from "./utils";

export interface InvestimentDTO {
  name: string,
  investiment_type: string,
  segment: string,
  currency_name: string,
  quantity: number | null,
  average_price: number | null,
  actual_price: number | null,
};

export interface InvestimentsDataDTO {
  investiments: InvestimentDTO[];
};

export const useInvestimentsData = () => {
  const [investimentsData, setInvestimentsData] = useState<InvestimentsDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    
  useMemo(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const financingApi = new FinancingApi();
      try {
        const [currencies, investiments, operations, prices] = await Promise.all([
          financingApi.currencies.get({}),
          financingApi.investiments.get({}),
          financingApi.operations.get({}),
          financingApi.prices.get({})
        ]);

        const pricesObject : { [key: string]: number } = {};
        prices.forEach(p => pricesObject[p.investiment_id] = p.price);

        const data : InvestimentsDataDTO = {
          investiments: [],
        };

        const investiments_by_id : {[key: string]: InvestimentDTO} = {};

        investiments.forEach(investiment => {
          const operationsByInvestiment = getInvestimentOperations(investiment.id, operations);

          const investimentData = {
            name: investiment.name,
            investiment_type: investiment.investiment_type,
            segment: investiment.segment,
            currency_name: currencies.find(c => c.id === investiment.currency_id)?.name ?? '-',
            quantity: operationsByInvestiment.quantity,
            average_price: operationsByInvestiment.averagePrice,
            actual_price: pricesObject[investiment.id] ?? 0,
          }

          data.investiments.push(investimentData);
          investiments_by_id[investiment.id] = investimentData;
        });

        setInvestimentsData(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { investimentsData, isLoading };
};
