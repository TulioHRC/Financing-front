import { useState } from "react";
import GenericTable from "../../components/generic-table/GenericTable";
import { removeDividendById } from "../../hooks/functions/removeById";
import { DividendsDTO, useDividendsData } from "../../hooks/useDividendsData";
import { DividendsContainer, HiddenInput, UploadButton } from "./styles/styled-components";
import * as XLSX from "xlsx";
import { readDividendsB3Sheet } from "../../hooks/readDividendsB3Sheet";

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

  console.log(data)

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleButtonClick = async (id: string) => {
    const res = await removeDividendById(id);
    console.log(`deleted: ${res}`);

    refetch();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          readDividendsB3Sheet(jsonData as string[][]);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  if (isLoading || data === null) {
    return <div>Loading...</div>;
  }

  console.log(data)

  return (
    <DividendsContainer>
      <UploadButton>
        Load monthly dividend B3 sheet
        <HiddenInput
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
        />
      </UploadButton>
      <GenericTable
        data={data}
        filters={filters}
        onFilterChange={handleFilterChange}
        onRowButtonClick={handleButtonClick}
      />
    </DividendsContainer>
  );
};

export default Dividends;  