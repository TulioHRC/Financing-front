import { useState } from "react";
import GenericTable from "../../components/generic-table/GenericTable";
import { removeDividendById } from "../../hooks/functions/removeById";
import { DividendsDTO, useDividendsData } from "../../hooks/useDividendsData";

const Dividends: React.FC = () => {
  const { data, isLoading, refetch } = useDividendsData();
  const [filters, setFilters] = useState<DividendsDTO>({
    id: '',
    investimentName: '',
    paymentDate: '',
    value: null,
    valueAfterFees: null,
    quantity: null,
    totalValue: null,
  });

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleButtonClick = async (id: string) => {
    const res = await removeDividendById(id);
    console.log(`deleted: ${res}`);

    refetch();
  };

  console.log(data)

  if (isLoading || data === null || data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <GenericTable
      data={data}
      filters={filters}
      onFilterChange={handleFilterChange}
      onRowButtonClick={handleButtonClick}
    />
  );
};

export default Dividends;  