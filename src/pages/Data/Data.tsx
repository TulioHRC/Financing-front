import { useState } from "react";
import { usePricesData } from "../../hooks/usePricesData";
import { Button, Container, PriceDiv } from "./styles/styled-components";
import { FinancingApi } from "../../services/financing-server/financing-api";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { UpdatePricesModal } from "./UpdatePricesModal";

const Data: React.FC = () => {
  const { data, isLoading, refetch } = usePricesData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const openUpdateModal = () => setIsUpdateModalOpen(true);
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    refetch();
  };

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

    setEditingId(null);
    try {
      await financingApiService.prices.post({
        body: {
          investiment_id: id,
          price: parseFloat(newPrice),
        },
      });

      refetch();

      toast.success("Price updated successfully");
    } catch {
      toast.error("Failed to update price");
    }
  };

  return (
    <Container>
      <Button onClick={openUpdateModal}>
        Update everything via API
      </Button>
      {Object.entries(groupedInvestments).map(([type, investments]) => (
        <div key={type}>
          <h2>{type}</h2>
          <ul>
            {investments.map((investment) => (
              <PriceDiv key={investment.id}>
                {investment.name} -{" "}
                {editingId === investment.id ? (
                  <>
                    <input
                      type="text"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' ? handleSave(investment.id) : null}
                    />
                    <button style={{
                      padding: "5px 10px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }} onClick={() => handleSave(investment.id)}>Save</button>
                  </>
                ) : (
                  <>
                    {investment.price !== null ? `${investment.price}` : 'Not available'}
                    <button
                      style={{
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
              </PriceDiv>
            ))}
          </ul>
        </div>
      ))}
      <Toaster position="bottom-right" />
      <UpdatePricesModal
        open={isUpdateModalOpen}
        onClose={closeUpdateModal}
        investments={data.investiments}
      />
    </Container>
  );
};

export default Data;