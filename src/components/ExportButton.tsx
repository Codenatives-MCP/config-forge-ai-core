
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DatabaseConfig } from '../types/database';

interface ExportButtonProps {
  onExport: () => DatabaseConfig;
}

const ExportButton = ({ onExport }: ExportButtonProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    const config = onExport();
    const jsonString = JSON.stringify(config, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'db.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "db.json file has been downloaded."
    });
  };

  return (
    <div className="flex justify-center">
      <Button onClick={handleExport} size="lg" className="px-8">
        <Download className="w-4 h-4 mr-2" />
        Export to db.json
      </Button>
    </div>
  );
};

export default ExportButton;
