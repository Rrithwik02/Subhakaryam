import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviceCategories } from "@/data/services";

interface ServiceSelectionProps {
  onServiceChange: (value: string) => void;
  className?: string;
}

export function ServiceSelection({ onServiceChange, className }: ServiceSelectionProps) {
  return (
    <div className={className}>
      <div className="space-y-2">
        <Label>Service Category</Label>
        <Select onValueChange={onServiceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select your service category" />
          </SelectTrigger>
          <SelectContent>
            {serviceCategories.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}