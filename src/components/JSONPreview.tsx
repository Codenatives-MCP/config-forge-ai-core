
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatabaseConfig } from '../types/database';

interface JSONPreviewProps {
  data: DatabaseConfig;
}

const JSONPreview = ({ data }: JSONPreviewProps) => {
  const jsonString = JSON.stringify(data, null, 2);

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">JSON Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-lg max-h-96 overflow-auto">
          <pre className="text-xs whitespace-pre-wrap font-mono">
            {jsonString}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default JSONPreview;
