
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CSVUploader from './components/CSVUploader';
import TableEditor from './components/TableEditor';
import DatabaseNameInput from './components/DatabaseNameInput';
import ExportButton from './components/ExportButton';
import JSONPreview from './components/JSONPreview';
import { TableData } from './types/database';

const queryClient = new QueryClient();

const App = () => {
  const [databaseName, setDatabaseName] = useState('');
  const [tables, setTables] = useState<TableData[]>([]);

  const generateDBConfig = () => {
    return {
      databases: {
        [databaseName || 'untitled_db']: {
          description: `${databaseName || 'untitled_db'} database`,
          tables: tables.map(table => ({
            name: table.name,
            description: table.description || `${table.name} table`,
            columns: table.columns,
            sample_data_rows: table.sampleData.slice(0, 5)
          }))
        }
      }
    };
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">CN</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">CodeNatives</h1>
                    <p className="text-sm text-muted-foreground">CSV to Database Configuration Tool</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Panel - Editor */}
              <div className="lg:col-span-2 space-y-6">
                <DatabaseNameInput value={databaseName} onChange={setDatabaseName} />
                
                <CSVUploader onFilesUploaded={setTables} />
                
                {tables.length > 0 && (
                  <TableEditor tables={tables} onTablesChange={setTables} />
                )}
                
                {tables.length > 0 && (
                  <ExportButton onExport={() => generateDBConfig()} />
                )}
              </div>

              {/* Right Panel - Preview */}
              <div className="lg:col-span-1">
                <JSONPreview data={generateDBConfig()} />
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
