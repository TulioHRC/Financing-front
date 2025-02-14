import { useState, useEffect } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";
import { getInvestimentOperations } from "./utils";

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
};

export const useDashboardData = (currency: {id: string, name: string}) => {
    const [portfolioData, setPortfolioData] = useState<DashboardDataDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const fetchData = async () => {
          const financingApi = new FinancingApi();
            try {
                const currencies = await financingApi.currencies.get({});

                const [investiments, operations] = await Promise.all([
                    financingApi.investiments.get({}),
                    financingApi.operations.get({}),
                ]);

                console.log(investiments, operations)

                const dolar_quotation = currencies.find(c => c.name === 'USD')?.quotation_in_BRL ?? null;
                const btc_quotation = currencies.find(c => c.name === 'BTC')?.quotation_in_BRL ?? null;

                const data : DashboardDataDTO = { investiments: [] };

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
                        actual_price: 0.5,
                    });
                });

                setPortfolioData(data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { portfolioData, isLoading };
};
