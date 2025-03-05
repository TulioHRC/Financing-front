import { useState } from "react";
import GenericTable from "../../components/generic-table/GenericTable";
import { InvestimentDTO, useInvestimentsData } from "../../hooks/useInvestimentsData";

const Investiments: React.FC = () => {
  const { investimentsData, isLoading } = useInvestimentsData();
  const [filters, setFilters] = useState<InvestimentDTO>({
    name: '',
    investiment_type: '',
    segment: '',
    currency_name: '',
    quantity: null,
    average_price: null,
    actual_price: null,
  });

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  if (isLoading || investimentsData === null) {
    return <div>Loading...</div>;
  }

  return (
    <GenericTable
      data={investimentsData.investiments}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
};

export default Investiments;