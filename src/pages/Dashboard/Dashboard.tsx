import { Container, ChartsContainer, PortifolioContainer } from "./styles/styled-components";
import { Dropdown } from "../../components/dropdown/Dropdown";
import { useDashboardData } from "../../hooks/useDashboardData";
import { FinancingInvestimentsPostResponseDTO } from "../../services/financing-server/investiments/dto/financing-investiments.post.response.dto";

interface ItemDTO {
    label: string;
    value: string | number;
}

export interface PortfolioDTO {
    [key: string]: ItemDTO[];
}

const transformPortifolioDataInDropdownItems = (data: FinancingInvestimentsPostResponseDTO) : PortfolioDTO => {
    const portfolioData : PortfolioDTO = {};
    const types = [...new Set(data.map(investiment => investiment.investiment_type))];
    for (const type of types) {
        portfolioData[type] = portfolioData[type] || [];
    }

    data.forEach(inv => {
        portfolioData[inv.investiment_type].push({
            label: inv.name,
            value: inv.id
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