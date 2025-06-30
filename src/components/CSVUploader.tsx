import { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { parseCSVFiles } from '../lib/csvParser';
import { TableData } from '../types/database';
import { useToast } from "@/hooks/use-toast";

interface CSVUploaderProps {
  onFilesUploaded: (tables: TableData[]) => void;
}

const CSVUploader = ({ onFilesUploaded }: CSVUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = async (files: FileList) => {
    const supportedFiles = Array.from(files).filter(file =>
      file.name.match(/\.(csv|tsv|xlsx|xls|json)$/i)
    );

    if (supportedFiles.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please upload .csv, .tsv, .xlsx, .xls, or .json files.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const tables = await parseCSVFiles(supportedFiles);
      onFilesUploaded(tables);
      toast({
        title: "Files uploaded successfully",
        description: `Processed ${supportedFiles.length} file(s).`
      });
    } catch (error) {
      console.error('Error parsing files:', error);
      toast({
        title: "Error processing files",
        description: "There was an error parsing your files.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <Card>
      <CardContent className="p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Files</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop .csv, .tsv, .xlsx, .xls, or .json files here, or click to browse
              </p>
            </div>

            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <FileText className="w-4 h-4 mr-2" />
              Choose Files
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.tsv,.xlsx,.xls,.json"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVUploader;
