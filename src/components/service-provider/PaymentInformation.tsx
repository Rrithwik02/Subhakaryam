
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface PaymentInformationProps {
  className?: string;
  onPaymentMethodChange: (method: "bank_account" | "upi" | "qr_code") => void;
  onAdvancePaymentChange?: (requiresAdvance: boolean, percentage: number) => void;
  initialAdvanceSettings?: {
    requiresAdvance: boolean;
    percentage: number;
  };
}

export function PaymentInformation({ 
  className, 
  onPaymentMethodChange, 
  onAdvancePaymentChange,
  initialAdvanceSettings = { requiresAdvance: false, percentage: 0 }
}: PaymentInformationProps) {
  const [paymentMethod, setPaymentMethod] = useState<"bank_account" | "upi" | "qr_code">("bank_account");
  const [requiresAdvancePayment, setRequiresAdvancePayment] = useState(initialAdvanceSettings.requiresAdvance);
  const [advancePercentage, setAdvancePercentage] = useState([initialAdvanceSettings.percentage]);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as "bank_account" | "upi" | "qr_code");
    onPaymentMethodChange(value as "bank_account" | "upi" | "qr_code");
  };

  const handleAdvancePaymentToggle = (checked: boolean) => {
    setRequiresAdvancePayment(checked);
    onAdvancePaymentChange?.(checked, advancePercentage[0]);
  };

  const handleAdvancePercentageChange = (value: number[]) => {
    setAdvancePercentage(value);
    onAdvancePaymentChange?.(requiresAdvancePayment, value[0]);
  };

  return (
    <div className={className}>
      <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-6">
        Payment Information
      </h2>
      
      <div className="space-y-6">
        <RadioGroup
          defaultValue="bank_account"
          onValueChange={handlePaymentMethodChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="flex items-center space-x-2 border p-4 rounded-lg">
            <RadioGroupItem value="bank_account" id="bank_account" />
            <Label htmlFor="bank_account">Bank Account</Label>
          </div>
          <div className="flex items-center space-x-2 border p-4 rounded-lg">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi">UPI</Label>
          </div>
          <div className="flex items-center space-x-2 border p-4 rounded-lg">
            <RadioGroupItem value="qr_code" id="qr_code" />
            <Label htmlFor="qr_code">QR Code</Label>
          </div>
        </RadioGroup>

        {paymentMethod === "bank_account" && (
          <div className="space-y-4">
            <div>
              <Label>Account Holder Name</Label>
              <Input
                name="account_holder_name"
                required
                placeholder="Enter account holder name"
              />
            </div>
            <div>
              <Label>Bank Name</Label>
              <Input
                name="bank_name"
                required
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input
                name="account_number"
                required
                placeholder="Enter account number"
              />
            </div>
            <div>
              <Label>IFSC Code</Label>
              <Input
                name="ifsc_code"
                required
                placeholder="Enter IFSC code"
              />
            </div>
          </div>
        )}

        {paymentMethod === "upi" && (
          <div>
            <Label>UPI ID</Label>
            <Input
              name="upi_id"
              required
              placeholder="Enter UPI ID"
            />
          </div>
        )}

        {paymentMethod === "qr_code" && (
          <div>
            <Label>Upload QR Code</Label>
            <ImageUpload
              onUploadComplete={(url) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'qr_code_url';
                input.value = url;
                document.querySelector('form')?.appendChild(input);
              }}
              className="mt-2"
              maxSizeInBytes={5 * 1024 * 1024}
              allowedFileTypes={['image/jpeg', 'image/png']}
            />
          </div>
        )}

        {/* Advance Payment Settings */}
        <div className="space-y-6 pt-6 border-t border-ceremonial-gold/20">
          <h3 className="text-lg font-display font-semibold text-ceremonial-maroon">
            Advance Payment Settings
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="advance-payment">Require Advance Payment</Label>
              <p className="text-sm text-muted-foreground">
                Customers will pay a percentage upfront to confirm their booking
              </p>
            </div>
            <Switch
              id="advance-payment"
              checked={requiresAdvancePayment}
              onCheckedChange={handleAdvancePaymentToggle}
            />
          </div>

          {requiresAdvancePayment && (
            <div className="space-y-4">
              <div>
                <Label>Advance Payment Percentage: {advancePercentage[0]}%</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Set how much customers need to pay upfront (maximum 50%)
                </p>
                <Slider
                  value={advancePercentage}
                  onValueChange={handleAdvancePercentageChange}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1%</span>
                  <span>50%</span>
                </div>
              </div>
              
              <div className="bg-ceremonial-cream/30 p-4 rounded-lg">
                <p className="text-sm font-medium text-ceremonial-maroon">
                  Payment Structure Preview:
                </p>
                <ul className="text-sm text-ceremonial-maroon mt-2 space-y-1">
                  <li>• Advance Payment: {advancePercentage[0]}% (non-refundable)</li>
                  <li>• Final Payment: {100 - advancePercentage[0]}% (refundable based on cancellation policy)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
