import { Container, ChartsContainer, PortifolioContainer, SwitchContainer, HeaderContainer, Box } from "./styles/styled-components";
import { Dropdown, formatCurrency, PortfolioDTO } from "../../components/dropdown/Dropdown";
import { DashboardDataDTO, useDashboardData } from "../../hooks/useDashboardData";
import { useState } from "react";
import { Switch } from "../../components/switch/Switch";
import PieChartComponent, { PieChartData } from "../../components/charts/PieChartComponent";
import BarChartComponent, { BarChartData } from "../../components/charts/BarChartComponent";

const transformPortifolioDataInInvestedByType = (data: DashboardDataDTO) : PieChartData => {
  const res : PieChartData = [];
  const investedByType : { [key: string] : number } = {};
  const types = [...new Set(data.investiments.map(investiment => investiment.investiment_type)), 'CURRENCIES'];
  for (const type of types) {
    investedByType[type] = 0;
  }

  data.investiments.forEach(inv => {
    if (inv.quantity > 0) {
      investedByType[inv.investiment_type] += inv.quantity * inv.average_price * inv.quotation;
    }
  });

  data.currencies_investiments.forEach(cInv => {
    if (cInv.quantity > 0) {
      investedByType['CURRENCIES'] += ((cInv.quantity - cInv.used_quantity) / cInv.quantity)  * cInv.price;
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

const transformPortifolioDataInPatrimonialGrowth = (data: DashboardDataDTO) : BarChartData => {
  const res : BarChartData = [];

  Object.keys(data.patrimony_by_month).forEach(key => {
    res.push({
      name: key,
      value: data.patrimony_by_month[key],
    });
  })

  return res;
}

const transformPortifolioDataInActualByType = (data: DashboardDataDTO) : PieChartData => {
  const res : PieChartData = [];
  const actualByType : { [key: string] : number } = {};
  const types = [...new Set(data.investiments.map(investiment => investiment.investiment_type)), 'CURRENCIES'];
  for (const type of types) {
    actualByType[type] = 0;
  }

  data.investiments.forEach(inv => {
    if (inv.quantity > 0) {
      actualByType[inv.investiment_type] += inv.quantity * (inv.actual_price ?? 0) * inv.quotation;
    }
  });

  data.currencies_investiments.forEach(cInv => {
    if (cInv.quantity > 0) {
      actualByType['CURRENCIES'] += (cInv.quantity - cInv.used_quantity)  * cInv.quotation;
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
  const types = [...new Set(data.investiments.map(investiment => investiment.investiment_type)), 'CURRENCIES'];
  for (const type of types) {
    portfilioData[type] = portfilioData[type] || [];
  }

  let allocatedValue = data.investiments.reduce((acc, actual) => (actual.quantity !== 0 && actual.average_price) ? 
    actual.average_price * actual.quantity + acc : acc, 0);
  allocatedValue += data.currencies_investiments.reduce((acc, actual) => acc + actual.price * ((actual.quantity - actual.used_quantity) / actual.quantity), 0);
    
  let actualValue = data.investiments.reduce((acc, actual) => (actual.quantity !== 0 && actual.actual_price) ? 
    actual.actual_price * actual.quantity + acc : acc, 0);
  actualValue += data.currencies_investiments.reduce((acc, actual) => acc + actual.quotation * (actual.quantity - actual.used_quantity), 0);
    
  data.currencies_investiments.forEach(cInv => {
    if (cInv.quantity > 0)
      portfilioData['CURRENCIES'].push({
        label: cInv.name,
        quantity: cInv.quantity - cInv.used_quantity,
        averagePrice: cInv.price / cInv.quantity,
        allocatedPercentage: (((cInv.quantity - cInv.used_quantity) / cInv.quantity) * cInv.price / allocatedValue) * 100,
        actualPrice: cInv.quotation,
        actualPercentage: ((cInv.quantity - cInv.used_quantity) * cInv.quotation / actualValue) * 100,
      });
  });

  data.investiments.forEach(inv => {
    if (inv.quantity > 0)
      portfilioData[inv.investiment_type].push({
        label: inv.name,
        quantity: inv.quantity,
        averagePrice: inv.average_price * inv.quotation,
        allocatedPercentage: ((inv.quantity * (inv.average_price ?? 0) * inv.quotation) / allocatedValue) * 100,
        actualPrice: (inv.actual_price ?? 0) * inv.quotation,
        actualPercentage: ((inv.quantity * (inv.actual_price ?? 0) * inv.quotation) / actualValue) * 100,
      });
  });

  return portfilioData;
}

const Dashboard: React.FC = () => {
  const [currency, setCurrency] = useState<string>(import.meta.env.VITE_MAIN_CURRENCY_ID);
  const { portfilioData, isLoading } = useDashboardData({ id: currency });

  if (isLoading || portfilioData === null) {
    return <div>Loading...</div>;
  }

  // Calcular o valor investido total
  const investedValue = transformPortifolioDataInInvestedByType(portfilioData).reduce((acc, curr) => acc + curr.value, 0);

  // Calcular o valor atual total
  const actualValue = transformPortifolioDataInActualByType(portfilioData).reduce((acc, curr) => acc + curr.value, 0);

  // Calcular a porcentagem de crescimento
  const growthPercentage = ((actualValue - investedValue) / investedValue) * 100;

  // Determinar se é lucro, perda ou neutro
  const isProfit = growthPercentage > 0;
  const isLoss = growthPercentage < 0;

  return (
    <Container>
      <SwitchContainer>
        <Switch
          options={portfilioData.currencies.map((c) => ({
            value: c.id,
            text: c.name,
          }))}
          selectedOption={currency}
          setFunction={setCurrency}
        />
      </SwitchContainer>
      <ChartsContainer>
        <PieChartComponent title="Invested" data={transformPortifolioDataInInvestedByType(portfilioData)} />
        <PieChartComponent title="Actual" data={transformPortifolioDataInActualByType(portfilioData)} />
        <BarChartComponent title="Patrimonial Growth" data={transformPortifolioDataInPatrimonialGrowth(portfilioData)} />
      </ChartsContainer>
      <PortifolioContainer>
        <HeaderContainer>
          <Box>
            <p>Invested Value</p>
            <h3>{formatCurrency(investedValue, portfilioData.currencies.find((c) => c.id === currency)?.name)}</h3>
          </Box>
          <Box>
            <p>Actual Value</p>
            <div>
              <h3>{formatCurrency(actualValue, portfilioData.currencies.find((c) => c.id === currency)?.name)}</h3>
              <span
                style={{
                  color: isProfit ? "#4CAF50" : isLoss ? "#F44336" : "inherit",
                }}
              >
                {growthPercentage.toFixed(2)}%
              </span>
            </div>
          </Box>
        </HeaderContainer>
        {Object.entries(transformPortifolioDataInDropdownItems(portfilioData)).map(([type, item]) => (
          <Dropdown name={type} items={item} key={type} currency={portfilioData.currencies.find((c) => c.id === currency)?.name} />
        ))}
      </PortifolioContainer>
    </Container>
  );
};

export default Dashboard;