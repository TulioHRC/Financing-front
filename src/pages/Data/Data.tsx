import { useState } from "react";
import { usePricesData } from "../../hooks/usePricesData";
import { Container } from "./styles/styled-components";
import { FinancingApi } from "../../services/financing-server/financing-api";

const Data: React.FC = () => {
  const { data, isLoading, refetch } = usePricesData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");

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

  const handleEditClick = (id: string, currentPrice: string) => {
    setEditingId(id);
    setNewPrice(currentPrice);
  };

  const handleSave = async (id: string) => {
    const financingApiService = new FinancingApi();

    await financingApiService.prices.post({
      body: {
        investiment_id: id,
        price: parseFloat(newPrice),
      }
    });
    
    setEditingId(null);
    refetch();
  };

  return (
    <Container>
      {Object.entries(groupedInvestments).map(([type, investments]) => (
        <div key={type}>
          <h2>{type}</h2>
          <ul>
            {investments.map((investment) => (
              <li key={investment.id}>
                {investment.name} -{" "}
                {editingId === investment.id ? (
                  <>
                    <input
                      type="text"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                    <button onClick={() => handleSave(investment.id)}>Save</button>
                  </>
                ) : (
                  <>
                    {investment.price !== null ? `${investment.price}` : 'Not available'}
                    <button
                      style={{
                        marginLeft: "10px",
                        padding: "5px 10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleEditClick(
                          investment.id,
                          investment.price !== null ? investment.price.toString() : ""
                        )
                      }
                    >
                      Edit
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Container>
  );
};

export default Data;