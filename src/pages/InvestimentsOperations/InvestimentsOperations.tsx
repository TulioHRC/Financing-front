import { useState } from "react";
import GenericTable from "../../components/generic-table/GenericTable";
import { InvestimentOperationsDTO, useInvestimentsOperationsData } from "../../hooks/useInvestimentsOperationsData";

const InvestimentsOperations: React.FC = () => {
  const { investimentsData, isLoading } = useInvestimentsOperationsData();
  const [filters, setFilters] = useState<InvestimentOperationsDTO>({
    name: '',
    currency_name: '',
    price: null,
    quantity: null,
    date: null,
  });

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  if (isLoading || investimentsData === null) {
    return <div>Loading...</div>;
  }

  return (
    <GenericTable
      data={investimentsData}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
};

export default InvestimentsOperations;