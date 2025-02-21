import { usePricesData } from "../../hooks/usePricesData";
import { Container } from "./styles/styled-components";

const Data : React.FC = () => {
  const { data, isLoading } = usePricesData();

  if (isLoading || data === null) {
    return <div>Loading...</div>;
  }

  const groupedInvestments = data.investiments.reduce((acc, investment) => {
    if (!acc[investment.type]) {
      acc[investment.type] = [];
    }
    acc[investment.type].push(investment);
    return acc;
  }, {} as { [key: string]: typeof data.investiments });

  return (
    <Container>
      {Object.entries(groupedInvestments).map(([type, investments]) => (
        <div key={type}>
          <h2>{type}</h2>
          <ul>
            {investments.map((investment) => (
              <li key={investment.id}>
                {investment.name} - {investment.price !== null ? `${investment.price}` : 'Not available'}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Container>
  );
};

export default Data;