import { Container, ChartsContainer, PortifolioContainer, SwitchContainer } from "./styles/styled-components";
import { Dropdown, PortfolioDTO } from "../../components/dropdown/Dropdown";
import { DashboardDataDTO, useDashboardData } from "../../hooks/useDashboardData";
import { useState } from "react";
import { Switch } from "../../components/switch/Switch";

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

// Put your own Ids
const currencies : {[key: string]: string} = {
    'USD': 'ee945987-ae22-4aba-a71b-dcd149c1beaa',
    'BRL': 'ea5b5f2b-2270-487b-8346-0360a2d8a294',
    'BTC': '2c9b4899-d121-4ace-958a-4732a6726181',
}

const Dashboard : React.FC = () => {
    const [currency, setCurrency] = useState<'USD' | 'BRL' | 'BTC'>('BRL');
    const { portfolioData, isLoading } = useDashboardData(currencies[currency]);

    if (isLoading || portfolioData === null) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <SwitchContainer>
                <Switch options={[
                    {
                        value: 'USD',
                        text: 'USD',
                    },
                    {
                        value: 'BRL',
                        text: 'BRL',
                    },
                    {
                        value: 'BTC',
                        text: 'BTC',
                    },
                ]} selectedOption={currency} setFunction={setCurrency} />
            </SwitchContainer>
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