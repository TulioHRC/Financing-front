import { useState } from "react";
import GenericTable from "../../components/generic-table/GenericTable";
import { CurrencyOperationsDTO, useCurrenciesOperationsData } from "../../hooks/useCurrenciesOperationsData";
import { removeCurrencyOperationsById } from "../../hooks/functions/removeById";

const CurrenciesOperations: React.FC = () => {
  const { d, isLoading, refetch } = useCurrenciesOperationsData();
  const [filters, setFilters] = useState<CurrencyOperationsDTO>({
    price: null,
    bought_currency_name: '',
    selled_currency_name: '',
    quantity: null,
    date: '',
  });

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleButtonClick = async (id: string) => {
    const res = await removeCurrencyOperationsById(id);
    console.log(`deleted: ${res}`);

    refetch();
  };

  if (isLoading || d === null) {
    return <div>Loading...</div>;
  }

  return (
    <GenericTable
      data={d}
      filters={filters}
      onFilterChange={handleFilterChange}
      onRowButtonClick={handleButtonClick}
    />
  );
};

export default CurrenciesOperations;