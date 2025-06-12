
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TableData, ColumnConfig } from '../types/database';

interface TableEditorProps {
  tables: TableData[];
  onTablesChange: (tables: TableData[]) => void;
}

const TableEditor = ({ tables, onTablesChange }: TableEditorProps) => {
  const updateTable = (index: number, updatedTable: TableData) => {
    const newTables = [...tables];
    newTables[index] = updatedTable;
    onTablesChange(newTables);
  };

  const updateColumn = (tableIndex: number, columnIndex: number, updatedColumn: ColumnConfig) => {
    const newTables = [...tables];
    newTables[tableIndex].columns[columnIndex] = updatedColumn;
    onTablesChange(newTables);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-4">
          {tables.map((table, tableIndex) => (
            <AccordionItem key={tableIndex} value={`table-${tableIndex}`} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">{table.name}</span>
                  <Badge variant="secondary">{table.columns.length} columns</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                {/* Table Description */}
                <div className="space-y-2">
                  <Label htmlFor={`table-desc-${tableIndex}`}>Table Description</Label>
                  <Textarea
                    id={`table-desc-${tableIndex}`}
                    value={table.description}
                    onChange={(e) => updateTable(tableIndex, { ...table, description: e.target.value })}
                    placeholder="Describe this table..."
                  />
                </div>

                {/* Columns */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Columns</h4>
                  {table.columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor={`col-name-${tableIndex}-${columnIndex}`}>Column Name</Label>
                        <Input
                          id={`col-name-${tableIndex}-${columnIndex}`}
                          value={column.name}
                          onChange={(e) => updateColumn(tableIndex, columnIndex, { ...column, name: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`col-type-${tableIndex}-${columnIndex}`}>Data Type</Label>
                        <Select
                          value={column.type}
                          onValueChange={(value: 'varchar' | 'int' | 'decimal' | 'date') => 
                            updateColumn(tableIndex, columnIndex, { ...column, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="varchar">VARCHAR</SelectItem>
                            <SelectItem value="int">INT</SelectItem>
                            <SelectItem value="decimal">DECIMAL</SelectItem>
                            <SelectItem value="date">DATE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`col-desc-${tableIndex}-${columnIndex}`}>Description</Label>
                        <Input
                          id={`col-desc-${tableIndex}-${columnIndex}`}
                          value={column.description}
                          onChange={(e) => updateColumn(tableIndex, columnIndex, { ...column, description: e.target.value })}
                          placeholder="Column description..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sample Data */}
                {table.sampleData.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Sample Data</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border rounded-lg">
                        <thead>
                          <tr className="bg-muted">
                            {table.columns.map((column, idx) => (
                              <th key={idx} className="border px-3 py-2 text-left font-medium">
                                {column.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.sampleData.slice(0, 3).map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {table.columns.map((column, colIdx) => (
                                <td key={colIdx} className="border px-3 py-2">
                                  {row[column.name] || '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TableEditor;
