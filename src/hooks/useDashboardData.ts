import { useState, useEffect } from "react";
import { FinancingApi } from "../services/financing-server/financing-api";
import { FinancingInvestimentsPostResponseDTO } from "../services/financing-server/investiments/dto/financing-investiments.post.response.dto";

export const useDashboardData = () => {
    const [portfolioData, setPortfolioData] = useState<FinancingInvestimentsPostResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const fetchData = async () => {
          const financingApi = new FinancingApi();
            try {
                const [investiments] = await Promise.all([
                    financingApi.investiments.get({}),
                ]);
                setPortfolioData(investiments);
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
