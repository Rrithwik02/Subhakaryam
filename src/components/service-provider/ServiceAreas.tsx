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
}

export function ServiceAreas({ className }: ServiceAreasProps) {
  return (
    <div className={className}>
      <div className="space-y-2">
        <Label>Service Areas</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select your service area" />
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
  );
}