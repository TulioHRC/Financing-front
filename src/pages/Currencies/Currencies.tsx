import { useState } from "react";
import GenericTable from "../../components/generic-table/GenericTable";
import { CurrencyInvestimentsDTO, useCurrenciesData } from "../../hooks/useCurrenciesData";

const Currencies: React.FC = () => {
  const { data, isLoading } = useCurrenciesData();
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

  if (isLoading || data === null) {
    return <div>Loading...</div>;
  }

  return (
    <GenericTable
      data={data.currencies_investiments}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
};

export default Currencies;