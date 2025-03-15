import { useState, useMemo, useCallback } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";
import { InvestimentDTO } from "../services/financing-server/investiments/dto/financing-investiments.get.response.dto";

export interface DividendsDTO {
  id?: string,
  investimentName: string,
  investimentType: string,
  paymentDate: string,
  value: number | null,
  valueAfterFees: number | null,
  quantity: number | null,
  totalValue: number | null,
};

export type DividendsDataDTO = DividendsDTO[];

export const useDividendsData = () => {
  const [data, setData] = useState<DividendsDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const financingApi = new FinancingApi();
    try {
      const [dividends, investiments, currencies] = await Promise.all([
        financingApi.dividends.get({}),
        financingApi.investiments.get({}),
        financingApi.currencies.get({})
      ]);

      const investimentById : {[key: string]: InvestimentDTO} = {};
      investiments.forEach((inv) => investimentById[inv.id] = inv);
      
      const dividendsData : DividendsDataDTO = dividends.map((d) => {
        const investiment = investimentById[d.investiment_id];

        const currencyQuotation = currencies.find((c) => c.id === investiment?.currency_id)?.quotation_in_BRL;

        return {
          id: d.id,
          investimentName: investiment?.name?? 'Unknown',
          investimentType: investiment?.investiment_type?? 'Unknown',
          paymentDate: d.date,
          value: d.value,
          valueAfterFees: d.value_after_fees,
          quantity: d.investiment_quantity,
          totalValue: d.investiment_quantity * d.value_after_fees * (currencyQuotation ?? 1),
        };
      });

      setData(dividendsData);
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