import { Container, ChartsContainer, PortifolioContainer, SwitchContainer } from "./styles/styled-components";
import { Dropdown, PortfolioDTO } from "../../components/dropdown/Dropdown";
import { DashboardDataDTO, useDashboardData } from "../../hooks/useDashboardData";
import { useState } from "react";
import { Switch } from "../../components/switch/Switch";
import { currencies } from "../../consts/ownIds";

const transformPortifolioDataInDropdownItems = (data: DashboardDataDTO) : PortfolioDTO => {
    const portfolioData : PortfolioDTO = {};
    const types = [...new Set(data.investiments.map(investiment => investiment.investiment_type))];
    for (const type of types) {
        portfolioData[type] = portfolioData[type] || [];
    }

    data.investiments.forEach(inv => {
        portfolioData[inv.investiment_type].push({
            label: inv.name,
            quantity: inv.quantity,
            averagePrice: inv.average_price,
            actualPrice: inv.actual_price,
        });
    });

    console.log(portfolioData)

    return portfolioData;
}

const Dashboard : React.FC = () => {
    const [currency, setCurrency] = useState<'USD' | 'BRL' | 'BTC'>('BRL');
    const { portfolioData, isLoading } = useDashboardData({id: currencies[currency], name: currency});

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
                        <Dropdown name={type} items={item} key={type} currency={currency} />
                    ))
                }
            </PortifolioContainer>
        </Container>
    )
}

export default Dashboard;