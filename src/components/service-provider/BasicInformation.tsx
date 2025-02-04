import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInformationProps {
  className?: string;
}

export function BasicInformation({ className }: BasicInformationProps) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-6">
        Basic Information
      </h2>
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base">Business Name</Label>
          <Input 
            name="business_name" 
            required 
            placeholder="Enter your business name"
            className="w-full"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-base">Owner's Full Name</Label>
          <Input 
            name="owner_name" 
            required 
            placeholder="Enter owner's full name"
            className="w-full"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-base">Email</Label>
          <Input 
            name="email" 
            type="email" 
            required 
            placeholder="Enter your email address"
            className="w-full"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-base">Phone</Label>
          <Input 
            name="phone" 
            type="tel" 
            required 
            placeholder="Enter your phone number"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}