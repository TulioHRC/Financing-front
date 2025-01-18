import { useState, useEffect } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";
import { FinancingInvestimentsGetResponseDTO } from "../services/financing-server/investiments/dto/financing-investiments.get.response.dto";

export interface DashboardDataDTO {
    investiments: FinancingInvestimentsGetResponseDTO;
};

export const useDashboardData = (currencyId: string) => {
    const [portfolioData, setPortfolioData] = useState<DashboardDataDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const fetchData = async () => {
          const financingApi = new FinancingApi();
            try {
                const [investiments] = await Promise.all([
                    financingApi.investiments.get({}),
                ]);
                setPortfolioData({
                    investiments,
                });
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
