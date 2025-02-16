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


  const allocatedValue = data.investiments.reduce((acc, actual) => (actual.quantity !== 0 && actual.average_price) ? 
    actual.average_price * actual.quantity + acc : acc, 0);
    
  const actualValue = data.investiments.reduce((acc, actual) => (actual.quantity !== 0 && actual.actual_price) ? 
    actual.actual_price * actual.quantity + acc : acc, 0);

  data.investiments.forEach(inv => {
    if (inv.quantity > 0)
      portfolioData[inv.investiment_type].push({
        label: inv.name,
        quantity: inv.quantity,
        averagePrice: inv.average_price,
        allocatedPercentage: ((inv.quantity * (inv.average_price ?? 0)) / allocatedValue) * 100,
        actualPrice: inv.actual_price,
        actualPercentage: ((inv.quantity * (inv.actual_price ?? 0)) / actualValue) * 100,
      });
  });

  return portfolioData;
}

const Dashboard : React.FC = () => {
  const [currency, setCurrency] = useState<string>('BRL');
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