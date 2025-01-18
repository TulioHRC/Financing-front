import { Container, ChartsContainer, PortifolioContainer } from "./styles/styled-components";
import { Dropdown, PortfolioDTO } from "../../components/dropdown/Dropdown";
import { DashboardDataDTO, useDashboardData } from "../../hooks/useDashboardData";

const transformPortifolioDataInDropdownItems = (data: DashboardDataDTO) : PortfolioDTO => {
    const portfolioData : PortfolioDTO = {};
    const types = [...new Set(data.investiments.map(investiment => investiment.investiment_type))];
    for (const type of types) {
        portfolioData[type] = portfolioData[type] || [];
    }

    data.investiments.forEach(inv => {
        portfolioData[inv.investiment_type].push({
            label: inv.name,
            quantity: 1,
            averagePrice: 1,
            actualPrice: 1,
        });
    })

    return portfolioData;
}

const Dashboard : React.FC = () => {
    const { portfolioData, isLoading } = useDashboardData();

    if (isLoading || portfolioData === null) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <ChartsContainer>
                Charts
            </ChartsContainer>
            <PortifolioContainer>
                {
                    Object.entries(transformPortifolioDataInDropdownItems(portfolioData)).map(([type, item]) => (
                        <Dropdown name={type} items={item} key={type} />
                    ))
                }
            </PortifolioContainer>
        </Container>
    )
}

export default Dashboard;