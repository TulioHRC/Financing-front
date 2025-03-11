import { useState } from "react";
import GenericTable from "../../components/generic-table/GenericTable";
import { CurrencyInvestimentsDTO, useCurrenciesData } from "../../hooks/useCurrenciesData";
import { removeCurrencyById } from "../../hooks/functions/removeById";

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
    const res = await removeCurrencyById(id);
    console.log(`deleted: ${res}`);

    refetch();
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
    />
  );
};

export default Currencies;  