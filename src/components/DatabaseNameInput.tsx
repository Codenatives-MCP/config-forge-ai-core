
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DatabaseNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const DatabaseNameInput = ({ value, onChange }: DatabaseNameInputProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="database-name">Database Name</Label>
          <Input
            id="database-name"
            placeholder="Enter database name (e.g., user_analytics_db)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseNameInput;
