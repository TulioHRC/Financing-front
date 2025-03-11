import { useState, useMemo } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";
import { getInvestimentOperations, getOldestInvestimentDate } from "./utils";

interface InvestimentsDTO {
  id: string,
  name: string,
  investiment_type: string,
  segment: string,
  currency_id: string,
  quotation: number,
  quantity: number,
  average_price: number,
  actual_price: number | null,
}

interface CurrencyInvestimentsDTO {
  id: string,
  name: string,
  quotation: number,
  quantity: number,
  price: number,
  used_quantity: number,
}

export interface DashboardDataDTO {
  investiments: InvestimentsDTO[];
  patrimony_by_month: {
    [month: string]: number;
  };
  currencies: {
    id: string,
    name: string,
    quotation_in_BRL: number | null,
  }[];
  currencies_investiments: CurrencyInvestimentsDTO[];
};

export const useDashboardData = (currency: {id: string}) => {
  const [portfilioData, setPortfilioData] = useState<DashboardDataDTO | null>(null);
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
          financingApi.prices.get({})
        ]);

        const pricesObject : { [key: string]: number } = {};
        prices.forEach(p => pricesObject[p.investiment_id] = p.price);

        const data : DashboardDataDTO = {
          investiments: [],
          patrimony_by_month: {},
          currencies: currencies.map(c => ({
            id: c.id,
            name: c.name,
            quotation_in_BRL: c.quotation_in_BRL,
          })),
          currencies_investiments: [],
        };

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

        const investiments_by_id : {[key: string]: InvestimentsDTO} = {};
        const currencies_investiments_by_id : {[currency_id: string]: CurrencyInvestimentsDTO} = {};

        currenciesOperations.forEach(op => {
          const quotation = 1 / (currencies.find(c => 
            c.id === currency.id)?.quotation_in_BRL ?? 0) *
            (currencies.find(c => 
              c.id === op.bought_currency_id)?.quotation_in_BRL ?? 0);
          const selled_quotation = 1 / (currencies.find(c => 
            c.id === currency.id)?.quotation_in_BRL ?? 0) *
            (currencies.find(c => 
              c.id === op.selled_currency_id)?.quotation_in_BRL ?? 0);
          const currency_id = op.bought_currency_id;
          const currency_investment = currencies_investiments_by_id[currency_id]?? {
            id: currency_id,
            name: currencies.find(c => c.id === currency_id)?.name?? '',
            quotation: 0,
            quantity: 0,
            price: 0,
            used_quantity: 0,
          };

          currency_investment.quantity += op.quantity;
          currency_investment.quotation = quotation;
          currency_investment.price += op.price * op.quantity * selled_quotation;

          currencies_investiments_by_id[currency_id] = currency_investment;
          // TODO: selled currency id logic
        })

        investiments.forEach(investiment => {
          const quotation = 1 / (currencies.find(c => 
            c.id === currency.id)?.quotation_in_BRL ?? 0) *
            (currencies.find(c => 
              c.id === investiment.currency_id)?.quotation_in_BRL ?? 0);
          
          const operationsByInvestiment = getInvestimentOperations(investiment.id, operations);

          const investimentData = {
            id: investiment.id,
            name: investiment.name,
            investiment_type: investiment.investiment_type,
            segment: investiment.segment,
            currency_id: investiment.currency_id,
            quotation,
            quantity: operationsByInvestiment.quantity,
            average_price: operationsByInvestiment.averagePrice,
            actual_price: pricesObject[investiment.id] ?? 0,
          }

          data.investiments.push(investimentData);
          investiments_by_id[investiment.id] = investimentData;

          if (currencies_investiments_by_id[investimentData.currency_id] && investimentData.quantity > 0){
            currencies_investiments_by_id[investimentData.currency_id].used_quantity += investimentData.average_price * investimentData.quantity;
          }
        });

        data.currencies_investiments = Object.keys(currencies_investiments_by_id).map(id => currencies_investiments_by_id[id]);

        const all_operations = [...operations, ...currenciesOperations];
        
        const sorted_operations_by_date = all_operations.sort((a, b) => 
          new Date(a.date?? 0).getTime() - new Date(b.date ?? 0).getTime());

        let actual_value = 0;
        for (const operation of sorted_operations_by_date) {
          if ('investiment_id' in operation) {
            if (investiments_by_id[operation.investiment_id].currency_id !== import.meta.env.VITE_MAIN_CURRENCY_ID) continue;

            actual_value += operation.price * operation.quantity * (investiments_by_id[operation.investiment_id]?.quotation ?? 0);
          } else {
            const selled_quotation = 1 / (currencies.find(c => 
              c.id === currency.id)?.quotation_in_BRL ?? 0) *
              (currencies.find(c => 
                c.id === operation.selled_currency_id)?.quotation_in_BRL ?? 0);
            actual_value += operation.price * operation.quantity * selled_quotation;
          }

          let actualMonth = new Date(operation.date).toISOString().slice(0, 7);

          // Sum in all the next months also
          while (actualMonth <= currentMonth) {
            data.patrimony_by_month[actualMonth] = actual_value;
  
            const [year, month] = actualMonth.split('-').map(Number);
            if (month === 12) {
              actualMonth = `${year + 1}-01`;
            } else {
              actualMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
            }
          }
        }

        setPortfilioData(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currency.id]);

  return { portfilioData, isLoading };
};
