
import Papa from 'papaparse';
import { TableData, ColumnConfig } from '../types/database';

export const parseCSVFiles = (files: File[]): Promise<TableData[]> => {
  return Promise.all(
    files.map(file => parseCSVFile(file))
  );
};

const parseCSVFile = (file: File): Promise<TableData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const tableName = file.name.replace('.csv', '');
        const columns: ColumnConfig[] = Object.keys(results.data[0] || {}).map(columnName => ({
          name: columnName,
          type: inferColumnType(results.data, columnName),
          description: `${columnName} column`
        }));

        resolve({
          name: tableName,
          description: `${tableName} table`,
          columns,
          sampleData: results.data.slice(0, 10) // Keep first 10 rows
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

const inferColumnType = (data: any[], columnName: string): 'varchar' | 'int' | 'decimal' | 'date' => {
  // Sample a few values to infer type
  const samples = data.slice(0, 5).map(row => row[columnName]).filter(val => val != null && val !== '');
  
  if (samples.length === 0) return 'varchar';
  
  // Check for integers
  if (samples.every(val => /^\d+$/.test(String(val)))) {
    return 'int';
  }
  
  // Check for decimals
  if (samples.every(val => /^\d*\.?\d+$/.test(String(val)))) {
    return 'decimal';
  }
  
  // Check for dates
  if (samples.every(val => !isNaN(Date.parse(String(val))))) {
    return 'date';
  }
  
  return 'varchar';
};
