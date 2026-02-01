import { useState } from "react";
import { FilterInput, Table, TableCell, TableContainer, TableHeader, TableRow } from "./styles/styled-components";

interface GenericTableProps<T> {
  data: T[];
  filters: T;
  onFilterChange: (field: keyof T, value: string) => void;
  onRowButtonClick?: (id: any) => void;
  buttonText?: string;
}

const GenericTable = <T extends Record<string, any>>({
  data,
  filters,
  onFilterChange,
  onRowButtonClick,
  buttonText="Remove"
}: GenericTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  if (data.length === 0) return (
    <p>No data found.</p>
  )

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter((item) =>
    Object.keys(filters).every((key) =>
      filters[key] === null || String(item[key]).toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig) {
      const key = sortConfig.key;
      if (a[key] < b[key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  return (
    <TableContainer>
      <div>
        {Object.keys(filters).map((field) => (
          <div key={field as string} style={{ display: 'inline-block', margin: '0 10px 10px 0' }}>
            <FilterInput
              type="text"
              placeholder={`Filter by ${field}`}
              value={filters[field as keyof T]}
              onChange={(e) => onFilterChange(field as keyof T, e.target.value)}
            />
          </div>
        ))}
      </div>
      <Table>
        <thead>
          <TableRow>
            {Object.keys(data[0]).filter(s => s !== 'id').map((header) => (
              <TableHeader key={header} onClick={() => handleSort(header as keyof T)}>
                {header}
                {sortConfig && sortConfig.key === header && (
                  <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHeader>
            ))}
            <TableHeader></TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.values({...row, id: null}).filter(v => v !== null).map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{String(cell)}</TableCell>
              ))}
              {row.id && (
                <TableCell>
                  <button onClick={() => onRowButtonClick?.(row.id)}>{buttonText}</button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default GenericTable;