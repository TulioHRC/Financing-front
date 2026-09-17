import { useState } from "react";
import { usePricesData } from "../../hooks/usePricesData";
import {
  Container,
  HeaderSection,
  TitleContainer,
  Title,
  Subtitle,
  Button,
  GridContainer,
  CategoryCard,
  CategoryTitle,
  InvestmentList,
  PriceRow,
  InvestmentName,
  ValueActionContainer,
  PriceValue,
  ActionButton,
  EditForm,
  PriceInput,
} from "./styles/styled-components";
import { financingApi } from "../../services/financing-server/financing-api";
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
    return (
      <Container style={{ justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Subtitle>Loading investments data...</Subtitle>
      </Container>
    );
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
    setEditingId(null);
    try {
      await financingApi.prices.post({
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

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <Container>
      <HeaderSection>
        <TitleContainer>
          <Title>Investment Prices</Title>
          <Subtitle>Manage and update prices for all current assets</Subtitle>
        </TitleContainer>
        <Button onClick={openUpdateModal}>
          <i className="fa-solid fa-arrows-rotate" />
          Update everything via API
        </Button>
      </HeaderSection>

      <GridContainer>
        {Object.entries(groupedInvestments).map(([type, investments]) => (
          <CategoryCard key={type}>
            <CategoryTitle>{type}</CategoryTitle>
            <InvestmentList>
              {investments.map((investment) => (
                <PriceRow key={investment.id}>
                  {editingId === investment.id ? (
                    <EditForm onSubmit={(e) => { e.preventDefault(); handleSave(investment.id); }}>
                      <InvestmentName style={{ marginRight: "8px" }}>{investment.name}</InvestmentName>
                      <PriceInput
                        type="number"
                        step="any"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        autoFocus
                      />
                      <ActionButton variant="primary" type="submit">
                        Save
                      </ActionButton>
                      <ActionButton
                        type="button"
                        style={{ border: "none", color: "#666" }}
                        onClick={handleCancel}
                      >
                        Cancel
                      </ActionButton>
                    </EditForm>
                  ) : (
                    <>
                      <InvestmentName>{investment.name}</InvestmentName>
                      <ValueActionContainer>
                        <PriceValue hasValue={investment.price !== null}>
                          {investment.price !== null ? `$ ${investment.price.toFixed(2)}` : "N/A"}
                        </PriceValue>
                        <ActionButton
                          onClick={() =>
                            handleEditClick(
                              investment.id,
                              investment.price !== null ? investment.price.toString() : ""
                            )
                          }
                        >
                          Edit
                        </ActionButton>
                      </ValueActionContainer>
                    </>
                  )}
                </PriceRow>
              ))}
            </InvestmentList>
          </CategoryCard>
        ))}
      </GridContainer>

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