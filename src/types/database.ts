
export interface ColumnConfig {
  name: string;
  type: 'varchar' | 'int' | 'decimal' | 'date';
  description: string;
}

export interface TableData {
  name: string;
  description: string;
  columns: ColumnConfig[];
  sampleData: any[];
}

export interface DatabaseConfig {
  databases: {
    [key: string]: {
      description: string;
      tables: {
        name: string;
        description: string;
        columns: ColumnConfig[];
        sample_data_rows: any[];
      }[];
    };
  };
}
