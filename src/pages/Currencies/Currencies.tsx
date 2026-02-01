import { useState } from "react";
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
    const newQuotation = Number(prompt("New Quotation:"));
    console.log(newQuotation, typeof newQuotation)
    if (newQuotation) {
      const res = await updateCurrencyById(id, {quotation_in_BRL: newQuotation});
      console.log(`updated: ${res}`);
  
      refetch();
    }
  };

  if (isLoading || data === null) {
    return <div>Loading...</div>;
  }

  return (
    <GenericTable
      data={data.currencies_investiments}
      filters={filters}
      onFilterChange={handleFilterChange}
      onRowButtonClick={handleButtonClick}
      buttonText="Edit"
    />
  );
};

export default Currencies;  