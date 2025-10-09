import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TravelChargesToggleProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function TravelChargesToggle({ value, onChange, className }: TravelChargesToggleProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="travel-charges" className="text-base">
          Travel Charges Applicable
        </Label>
        <Switch
          id="travel-charges"
          checked={value}
          onCheckedChange={onChange}
        />
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Enable if you charge extra for traveling to client locations
      </p>
    </div>
  );
}