import { useState, useRef, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import GenericTable from "../../components/generic-table/GenericTable";
import { removeDividendById } from "../../hooks/functions/removeById";
import { DividendsDTO, useDividendsData } from "../../hooks/useDividendsData";
import { DividendsContainer, HiddenInput, UploadButton, Alert, CloseButton, Spinner } from "./styles/styled-components";
import * as XLSX from "xlsx";
import { readDividendsB3Sheet } from "../../hooks/readDividendsB3Sheet";

const Dividends: React.FC = () => {
  const { data, isLoading, refetch } = useDividendsData();
  const [filters, setFilters] = useState<DividendsDTO>({
    investimentName: '',
    investimentType: '',
    paymentDate: '',
    value: null,
    valueAfterFees: null,
    quantity: null,
    totalValue: null,
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [percentagePosted, setPercentagePosted] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const graphData = useMemo(() => {
    if (!data) return [];

    const monthlyData: { [key: string]: { total: number; cumulative: number } } = {};
    let cumulativeTotal = 0;

    const filteredData: DividendsDTO[] = data.filter((item: DividendsDTO) =>
      Object.keys(filters).every((key) =>
        (filters as any)[key] === null || String((item as any)[key]).toLowerCase().includes(String((filters as any)[key]).toLowerCase())
      )
    );
  
    filteredData.forEach((dividend) => {
      const date = new Date(dividend.paymentDate);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // Format as YYYY-MM

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { total: 0, cumulative: 0 };
      }
      monthlyData[monthYear].total += dividend.totalValue || 0;
    });

    const result = Object.keys(monthlyData)
      .sort()
      .map((monthYear) => {
        cumulativeTotal += monthlyData[monthYear].total;
        return {
          month: monthYear,
          total: monthlyData[monthYear].total,
          cumulative: cumulativeTotal,
        };
      });

    return result;
  }, [data, filters]);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleButtonClick = async (id: string) => {
    const res = await removeDividendById(id);
    console.log(`deleted: ${res}`);

    refetch();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          readDividendsB3Sheet(jsonData as string[][])
            .then(({ successCount, totalCount }) => {
              const percentage = (successCount / totalCount) * 100;
              setPercentagePosted(percentage);
              setAlert({ type: 'success', message: `Successfully posted ${successCount} out of ${totalCount} rows` });
              refetch();
            })
            .catch((error) => {
              console.error(error);
              setAlert({ type: 'error', message: error?.message ?? "Error!" });
            })
            .finally(() => {
              setIsUploading(false);
            });
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleCloseAlert = () => {
    setAlert(null);
    setPercentagePosted(null);
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isLoading || data === null) {
    return <div>Loading...</div>;
  }

  return (
    <DividendsContainer>
      <div style={{ width: "100%", height: "300px", marginBottom: "2rem" }}>
        <ResponsiveContainer>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" dataKey="total" fill="#82ca9d" name="Monthly Dividends" />
            <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#8884d8" name="Cumulative Dividends" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <UploadButton onClick={handleUploadButtonClick} disabled={isUploading}>
        {isUploading ? (
          <>
            <span>Uploading...</span>
            <Spinner />
          </>
        ) : (
          "Load monthly dividend B3 sheet"
        )}
        <HiddenInput
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </UploadButton>
      {alert && (
        <Alert type={alert.type}>
          <span>
            {alert.message}
            {percentagePosted !== null && ` (${percentagePosted.toFixed(2)}% posted)`}
          </span>
          <CloseButton onClick={handleCloseAlert}>&times;</CloseButton>
        </Alert>
      )}
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