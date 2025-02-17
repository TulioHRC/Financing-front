import { Container, ChartsContainer, PortifolioContainer, SwitchContainer } from "./styles/styled-components";
import { Dropdown, PortfolioDTO } from "../../components/dropdown/Dropdown";
import { DashboardDataDTO, useDashboardData } from "../../hooks/useDashboardData";
import { useState } from "react";
import { Switch } from "../../components/switch/Switch";
import { currencies } from "../../consts/ownIds";
import PieChartComponent, { PieChartData } from "../../components/charts/PieChartComponent";
import BarChartComponent from "../../components/charts/BarChartComponent";

const transformPortifolioDataInInvestedByType = (data: DashboardDataDTO) : PieChartData => {
  const res : PieChartData = [];
  const investedByType : { [key: string] : number } = {};
  const types = [...new Set(data.investiments.map(investiment => investiment.investiment_type))];
  for (const type of types) {
    investedByType[type] = 0;
  }

  data.investiments.forEach(inv => {
    if (inv.quantity > 0) {
      investedByType[inv.investiment_type] += inv.quantity * inv.average_price;
    }
  });

  for (const type of types) {
    res.push({
      name: type,
      value: investedByType[type],
    });  
  }

  return res;
}

const transformPortifolioDataInActualByType = (data: DashboardDataDTO) : PieChartData => {
  const res : PieChartData = [];
  const actualByType : { [key: string] : number } = {};
  const types = [...new Set(data.investiments.map(investiment => investiment.investiment_type))];
  for (const type of types) {
    actualByType[type] = 0;
  }

  data.investiments.forEach(inv => {
    if (inv.quantity > 0) {
      actualByType[inv.investiment_type] += inv.quantity * (inv.actual_price ?? 0);
    }
  });

  for (const type of types) {
    res.push({
      name: type,
      value: actualByType[type],
    });  
  }

  return res;
}


const transformPortifolioDataInDropdownItems = (data: DashboardDataDTO) : PortfolioDTO => {
  const portfilioData : PortfolioDTO = {};
  const types = [...new Set(data.investiments.map(investiment => investiment.investiment_type))];
  for (const type of types) {
    portfilioData[type] = portfilioData[type] || [];
  }

  const allocatedValue = data.investiments.reduce((acc, actual) => (actual.quantity !== 0 && actual.average_price) ? 
    actual.average_price * actual.quantity + acc : acc, 0);
    
  const actualValue = data.investiments.reduce((acc, actual) => (actual.quantity !== 0 && actual.actual_price) ? 
    actual.actual_price * actual.quantity + acc : acc, 0);

  data.investiments.forEach(inv => {
    if (inv.quantity > 0)
      portfilioData[inv.investiment_type].push({
        label: inv.name,
        quantity: inv.quantity,
        averagePrice: inv.average_price,
        allocatedPercentage: ((inv.quantity * (inv.average_price ?? 0)) / allocatedValue) * 100,
        actualPrice: inv.actual_price,
        actualPercentage: ((inv.quantity * (inv.actual_price ?? 0)) / actualValue) * 100,
      });
  });

  return portfilioData;
}

const Dashboard : React.FC = () => {
  const [currency, setCurrency] = useState<string>('BRL');
  const { portfilioData, isLoading } = useDashboardData({id: currencies[currency], name: currency});

  if (isLoading || portfilioData === null) {
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
        <PieChartComponent title="Invested" data={transformPortifolioDataInInvestedByType(portfilioData)} />
        <PieChartComponent title="Actual" data={transformPortifolioDataInActualByType(portfilioData)} />
        <BarChartComponent title="Patrimonial Growth" />
      </ChartsContainer>
      <PortifolioContainer>
        {
          Object.entries(transformPortifolioDataInDropdownItems(portfilioData)).map(([type, item]) => (
            <Dropdown name={type} items={item} key={type} currency={currency} />
          ))
        }
      </PortifolioContainer>
    </Container>
  )
}

export default Dashboard;