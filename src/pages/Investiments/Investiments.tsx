import { useState } from "react";
import GenericTable from "../../components/generic-table/GenericTable";

const Investiments: React.FC = () => {
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    type: '',
    currency_id: '',
    segment: '',
  });

  const data = [
    { id: '1', name: 'Item 1', type: 'Type A', currency_id: 'USD', segment: 'Segment X' },
    { id: '2', name: 'Item 2', type: 'Type B', currency_id: 'EUR', segment: 'Segment Y' },
    { id: '3', name: 'Item 3', type: 'Type C', currency_id: 'GBP', segment: 'Segment Z' },
  ];

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <GenericTable
      data={data}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
};

export default Investiments;