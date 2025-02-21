import { useState, useMemo } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";
import { getInvestimentOperations, getOldestInvestimentDate } from "./utils";

export interface DashboardDataDTO {
  investiments: {
    id: string,
    name: string,
    investiment_type: string,
    segment: string,
    currency_id: string,
    quotation: number | null,
    quantity: number,
    average_price: number,
    actual_price: number | null,
  }[];
  patrimony_by_month: {
    [month: string]: number;
  }
};

export const useDashboardData = (currency: {id: string, name: string}) => {
  const [portfilioData, setPortfilioData] = useState<DashboardDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    
  useMemo(() => {
    const fetchData = async () => {
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

        const dolar_quotation = currencies.find(c => c.name === 'USD')?.quotation_in_BRL ?? null;
        const btc_quotation = currencies.find(c => c.name === 'BTC')?.quotation_in_BRL ?? null;

        const data : DashboardDataDTO = { investiments: [], patrimony_by_month: {} };

        const oldestInvestmentDate = getOldestInvestimentDate(operations);
        let oldestInvestmentMonth = new Date(oldestInvestmentDate).toISOString().slice(0, 7);

        const currentDate = new Date();
        const currentMonth = currentDate.toISOString().slice(0, 7);

        while (oldestInvestmentMonth <= currentMonth) {
          data.patrimony_by_month[oldestInvestmentMonth] = 0;

          const [year, month] = oldestInvestmentMonth.split('-').map(Number);
          if (month === 12) {
            oldestInvestmentMonth = `${year + 1}-01`;
          } else {
            oldestInvestmentMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
          }
        }

        const sorted_operations_by_date = operations.sort((a, b) => 
          new Date(b.date ?? 0).getTime() - new Date(a.date?? 0).getTime());

        let actual_value = 0;
        for (const operation of sorted_operations_by_date) {
          actual_value += operation.price * operation.quantity;
          let actualMonth = new Date(operation.date).toISOString().slice(0, 7);

          // Sum in all the next months also
          while (actualMonth <= currentMonth) {
            data.patrimony_by_month[actualMonth] += actual_value;
  
            const [year, month] = actualMonth.split('-').map(Number);
            if (month === 12) {
              actualMonth = `${year + 1}-01`;
            } else {
              actualMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
            }
          }
        }

        investiments.forEach(investiment => {
          // BRL quotation
          let quotation = currencies.find(c => 
            c.id === investiment.currency_id)?.quotation_in_BRL ?? null;
                    
          // Transforms quotation if needed
          if (quotation && dolar_quotation && currency.name === 'USD') {
            quotation = quotation / dolar_quotation;
          } else if (quotation && btc_quotation && currency.name === 'BTC') {
            quotation = quotation / btc_quotation;
          }

          const operationsByInvestiment = getInvestimentOperations(investiment.id, operations);

          data.investiments.push({
            id: investiment.id,
            name: investiment.name,
            investiment_type: investiment.investiment_type,
            segment: investiment.segment,
            currency_id: investiment.currency_id,
            quotation,
            quantity: operationsByInvestiment.quantity,
            average_price: operationsByInvestiment.averagePrice,
            actual_price: pricesObject[investiment.id] ?? 0,
          });
        });

        setPortfilioData(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency.id, currency.name]);

  return { portfilioData, isLoading };
};
