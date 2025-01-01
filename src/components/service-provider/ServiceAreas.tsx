import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serviceAreas = [
  { id: "vizag", name: "Visakhapatnam" },
  { id: "vijayawada", name: "Vijayawada" },
  { id: "hyderabad", name: "Hyderabad" },
];

interface ServiceAreasProps {
  className?: string;
  onPrimaryLocationChange: (value: string) => void;
  onSecondaryLocationChange: (value: string) => void;
}

export function ServiceAreas({ 
  className,
  onPrimaryLocationChange,
  onSecondaryLocationChange 
}: ServiceAreasProps) {
  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Primary Service Area (Required)</Label>
          <Select onValueChange={onPrimaryLocationChange} required>
            <SelectTrigger>
              <SelectValue placeholder="Select your primary service area" />
            </SelectTrigger>
            <SelectContent>
              {serviceAreas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Secondary Service Area (Optional)</Label>
          <Select onValueChange={onSecondaryLocationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select an additional service area (optional)" />
            </SelectTrigger>
            <SelectContent>
              {serviceAreas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}