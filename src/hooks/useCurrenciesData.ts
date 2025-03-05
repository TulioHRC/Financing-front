import { useState, useMemo } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";
import { getInvestimentOperations } from "./utils";

export interface CurrencyInvestimentsDTO {
  name: string;
  quotation: number | null;
  quantity: number | null;
  price: number | null;
  used_quantity: number | null;
}

export interface CurrenciesDataDTO {
  currencies_investiments: CurrencyInvestimentsDTO[];
}

export const useCurrenciesData = () => {
  const [data, setData] = useState<CurrenciesDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useMemo(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const financingApi = new FinancingApi();
      try {
        const [currencies, currenciesOperations, investiments, operations, prices] = await Promise.all([
          financingApi.currencies.get({}),
          financingApi.currenciesOperations.get({}),
          financingApi.investiments.get({}),
          financingApi.operations.get({}),
          financingApi.prices.get({}),
        ]);

        const pricesObject: { [key: string]: number } = {};
        prices.forEach((p) => (pricesObject[p.investiment_id] = p.price));

        const data: CurrenciesDataDTO = {
          currencies_investiments: [],
        };

        const investiments_by_id: { [key: string]: any } = {};
        const currencies_investiments_by_id: { [currency_id: string]: CurrencyInvestimentsDTO } = {};
        currencies.forEach(c => {
          const currency_investment = {
            name: c.name,
            quotation: c.quotation_in_BRL,
            quantity: 0,
            price: 0,
            used_quantity: 0,
          };

          currencies_investiments_by_id[c.id] = currency_investment;
        })

        currenciesOperations.forEach((op) => {
          const currency_id = op.bought_currency_id;
          const currency_investment = currencies_investiments_by_id[currency_id] ?? {
            name: currencies.find((c) => c.id === currency_id)?.name ?? "",
            quotation: 0,
            quantity: 0,
            price: 0,
            used_quantity: 0,
          };

          currency_investment.quantity = op.quantity + (currency_investment.quantity ?? 0);
          currency_investment.price = (currency_investment.price ?? 0) + op.price * op.quantity;

          currencies_investiments_by_id[currency_id] = currency_investment;
          // TODO: selled currency id logic
        });

        investiments.forEach((investiment) => {
          const operationsByInvestiment = getInvestimentOperations(investiment.id, operations);

          const investimentData = {
            id: investiment.id,
            name: investiment.name,
            investiment_type: investiment.investiment_type,
            segment: investiment.segment,
            currency_id: investiment.currency_id,
            quantity: operationsByInvestiment.quantity,
            average_price: operationsByInvestiment.averagePrice,
            actual_price: pricesObject[investiment.id] ?? 0,
          };

          investiments_by_id[investiment.id] = investimentData;

          if (currencies_investiments_by_id[investimentData.currency_id]) {
            currencies_investiments_by_id[investimentData.currency_id].used_quantity = investimentData.quantity * investimentData.average_price + (currencies_investiments_by_id[investimentData.currency_id].used_quantity ?? 0); // Corrected used_quantity calculation
          }
        });

        data.currencies_investiments = Object.keys(currencies_investiments_by_id).map((id) => currencies_investiments_by_id[id]);

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