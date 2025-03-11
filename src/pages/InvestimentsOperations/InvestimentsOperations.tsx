import { useState } from "react";
import GenericTable from "../../components/generic-table/GenericTable";
import { InvestimentOperationsDTO, useInvestimentsOperationsData } from "../../hooks/useInvestimentsOperationsData";
import { removeInvestimentsOperationsById } from "../../hooks/functions/removeById";

const InvestimentsOperations: React.FC = () => {
  const { investimentsData, isLoading, refetch } = useInvestimentsOperationsData();
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

  const handleButtonClick = async (id: string) => {
    const res = await removeInvestimentsOperationsById(id);
    console.log(`deleted: ${res}`);

    refetch();
  };

  if (isLoading || investimentsData === null) {
    return <div>Loading...</div>;
  }

  return (
    <GenericTable
      data={investimentsData}
      filters={filters}
      onFilterChange={handleFilterChange}
      onRowButtonClick={handleButtonClick}
    />
  );
};

export default InvestimentsOperations;