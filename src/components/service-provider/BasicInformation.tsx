import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInformationProps {
  className?: string;
}

export function BasicInformation({ className }: BasicInformationProps) {
  return (
    <div className={className}>
      <h2 className="text-xl font-display font-semibold text-ceremonial-maroon mb-4">
        Basic Information
      </h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Business Name</Label>
          <Input name="business_name" required />
        </div>
        <div className="space-y-2">
          <Label>Owner's Full Name</Label>
          <Input name="owner_name" required />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input name="phone" type="tel" required />
        </div>
      </div>
    </div>
  );
}