import { useState } from "react";
import GenericTable from "../../components/generic-table/GenericTable";
import { CurrencyOperationsDTO, useCurrenciesOperationsData } from "../../hooks/useCurrenciesOperationsData";

const Currencies: React.FC = () => {
  const { data, isLoading } = useCurrenciesOperationsData();
  const [filters, setFilters] = useState<CurrencyOperationsDTO>({
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
      data={data}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
};

export default Currencies;