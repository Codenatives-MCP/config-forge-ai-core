import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { TableData } from '../types/database';

export const parseCSVFiles = async (files: File[]): Promise<TableData[]> => {
  const tables: TableData[] = [];

  for (const file of files) {
    const name = file.name.toLowerCase();

    // Handle JSON files (optional)
    if (name.endsWith('.json')) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);

        // If it's a full db.json, skip for now (or implement merge logic)
        if (json.databases) {
          console.warn(`Skipped db.json structure in: ${file.name}`);
          continue;
        }

        // Otherwise, try to treat it as raw table data
        if (Array.isArray(json)) {
          const columns = Object.keys(json[0] || {});
          tables.push({
            name: file.name.replace(/\.json$/, ''),
            columns,
            rows: json,
            description: '',
          });
        }
      } catch (err) {
        console.error(`Failed to parse JSON: ${file.name}`, err);
      }
    }

    // Handle CSV and TSV files
    if (name.endsWith('.csv') || name.endsWith('.tsv')) {
      const text = await file.text();
      const delimiter = name.endsWith('.tsv') ? '\t' : ',';
      const parsed = Papa.parse(text, { header: true, delimiter });
      const columns = Object.keys(parsed.data[0] || {});
      tables.push({
        name: file.name.replace(/\.(csv|tsv)$/, ''),
        columns,
        rows: parsed.data as any[],
        description: '',
      });
    }

    // Handle Excel files (.xlsx, .xls)
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        const columns = Object.keys(json[0] || {});
        tables.push({
          name: file.name.replace(/\.(xlsx|xls)$/, ''),
          columns,
          rows: json,
          description: '',
        });
      } catch (err) {
        console.error(`Failed to parse Excel file: ${file.name}`, err);
      }
    }
  }

  return tables;
};
