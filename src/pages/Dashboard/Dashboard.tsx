import { Container, ChartsContainer, PortifolioContainer, SwitchContainer, HeaderContainer, Box } from "./styles/styled-components";
import { Dropdown, formatCurrency, PortfolioDTO } from "../../components/dropdown/Dropdown";
import { DashboardDataDTO, useDashboardData } from "../../hooks/useDashboardData";
import { useMemo, useState } from "react";
import { Switch } from "../../components/switch/Switch";
import PieChartComponent, { PieChartData } from "../../components/charts/PieChartComponent";
import BarChartComponent, { BarChartData } from "../../components/charts/BarChartComponent";

type InvestimentDataDTO = DashboardDataDTO['investiments'][number];
type CurrencyInvestimentDataDTO = DashboardDataDTO['currencies_investiments'][number];

const groupPortifolioByType = (
  data: DashboardDataDTO,
  investimentValue: (inv: InvestimentDataDTO) => number,
  currencyValue: (cInv: CurrencyInvestimentDataDTO) => number
) : PieChartData => {
  const valueByType : { [key: string] : number } = {};
  const types = [...new Set(data.investiments.map(investiment => investiment.investiment_type)), 'CURRENCIES'];
  for (const type of types) {
    valueByType[type] = 0;
  }

  data.investiments.forEach(inv => {
    if (inv.quantity > 0) {
      valueByType[inv.investiment_type] += investimentValue(inv);
    }
  });

  data.currencies_investiments.forEach(cInv => {
    if (cInv.quantity > 0) {
      valueByType['CURRENCIES'] += currencyValue(cInv);
    }
  });

  return types.map(type => ({ name: type, value: valueByType[type] }));
}

const transformPortifolioDataInInvestedByType = (data: DashboardDataDTO) : PieChartData =>
  groupPortifolioByType(
    data,
    inv => inv.quantity * inv.average_price * inv.quotation,
    cInv => ((cInv.quantity - cInv.used_quantity) / cInv.quantity) * cInv.price
  );

const transformPortifolioDataInActualByType = (data: DashboardDataDTO) : PieChartData =>
  groupPortifolioByType(
    data,
    inv => inv.quantity * (inv.actual_price ?? 0) * inv.quotation,
    cInv => (cInv.quantity - cInv.used_quantity) * cInv.quotation
  );

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

  const investedByType = useMemo(
    () => (portfilioData ? transformPortifolioDataInInvestedByType(portfilioData) : []),
    [portfilioData]
  );
  const actualByType = useMemo(
    () => (portfilioData ? transformPortifolioDataInActualByType(portfilioData) : []),
    [portfilioData]
  );
  const patrimonialGrowth = useMemo(
    () => (portfilioData ? transformPortifolioDataInPatrimonialGrowth(portfilioData) : []),
    [portfilioData]
  );
  const dropdownItems = useMemo(
    () => (portfilioData ? transformPortifolioDataInDropdownItems(portfilioData) : {}),
    [portfilioData]
  );

  if (isLoading || portfilioData === null) {
    return <div>Loading...</div>;
  }

  const investedValue = investedByType.reduce((acc, curr) => acc + curr.value, 0);
  const actualValue = actualByType.reduce((acc, curr) => acc + curr.value, 0);
  const growthPercentage = ((actualValue - investedValue) / investedValue) * 100;
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
        <PieChartComponent title="Invested" data={investedByType} />
        <PieChartComponent title="Actual" data={actualByType} />
        <BarChartComponent title="Patrimonial Growth" data={patrimonialGrowth} />
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
        {Object.entries(dropdownItems).map(([type, item]) => (
          <Dropdown name={type} items={item} key={type} currency={portfilioData.currencies.find((c) => c.id === currency)?.name} />
        ))}
      </PortifolioContainer>
    </Container>
  );
};

export default Dashboard;