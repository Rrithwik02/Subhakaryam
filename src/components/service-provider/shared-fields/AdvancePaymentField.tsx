import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdvancePaymentFieldProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function AdvancePaymentField({ value, onChange, className }: AdvancePaymentFieldProps) {
  return (
    <div className={className}>
      <Label className="text-base">Advance Payment Required (%)</Label>
      <Input
        type="number"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="e.g., 30"
        className="w-full"
      />
      <p className="text-sm text-muted-foreground mt-1">
        Percentage of total amount required as advance booking payment
      </p>
    </div>
  );
}