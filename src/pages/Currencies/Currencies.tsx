import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import GenericTable from "../../components/generic-table/GenericTable";
import { CurrencyInvestimentsDTO, useCurrenciesData } from "../../hooks/useCurrenciesData";
import { updateCurrencyById } from "../../hooks/functions/updateById";

const Currencies: React.FC = () => {
  const { data, isLoading, refetch } = useCurrenciesData();
  const [filters, setFilters] = useState<CurrencyInvestimentsDTO>({
    name: '',
    quotation: null,
    quantity: null,
    price: null,
    used_quantity: null,
  });

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleButtonClick = async (id: string) => {
    const promptValue = prompt("New Quotation:");
    if (promptValue === null) return;

    const newQuotation = Number(promptValue);
    if (promptValue.trim() === '' || Number.isNaN(newQuotation)) {
      toast.error("Invalid quotation value");
      return;
    }

    try {
      await updateCurrencyById(id, { quotation_in_BRL: newQuotation });
      toast.success("Quotation updated successfully");
      refetch();
    } catch {
      toast.error("Failed to update quotation");
    }
  };

  if (isLoading || data === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GenericTable
        data={data.currencies_investiments}
        filters={filters}
        onFilterChange={handleFilterChange}
        onRowButtonClick={handleButtonClick}
        buttonText="Edit"
      />
      <Toaster position="bottom-right" />
    </>
  );
};

export default Currencies;  