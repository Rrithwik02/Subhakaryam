import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IndianRupee } from "lucide-react";

interface PaymentRequestDialogProps {
  booking: any;
  children: React.ReactNode;
}

export const PaymentRequestDialog = ({ booking, children }: PaymentRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState(booking.total_amount);
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const maxAmount = booking.total_amount;
  const remainingAmount = maxAmount - (booking.paid_amount || 0);

  const createPaymentRequest = useMutation({
    mutationFn: async () => {
      if (customAmount > maxAmount) {
        throw new Error("Payment amount cannot exceed booking total");
      }

      // Create payment request
      const { error: paymentError } = await supabase
        .from("payments")
        .insert({
          booking_id: booking.id,
          amount: customAmount,
          payment_type: customAmount >= maxAmount ? 'final' : 'advance',
          status: 'pending',
          provider_requested_amount: customAmount,
          payment_description: description,
          is_provider_requested: true,
        });

      if (paymentError) throw paymentError;

      // Update booking to mark payment as requested
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ provider_payment_requested: true })
        .eq("id", booking.id);

      if (bookingError) throw bookingError;

      // Create Razorpay checkout session
      const { data: paymentData, error: checkoutError } = await supabase.functions.invoke('create-razorpay-checkout', {
        body: {
          bookingId: booking.id,
          paymentType: customAmount >= maxAmount ? 'final' : 'advance',
          amount: customAmount,
        },
      });

      if (checkoutError) throw checkoutError;

      return paymentData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      toast({
        title: "Payment Request Sent",
        description: `Payment request for ₹${customAmount} has been sent to the customer.`,
      });
      setOpen(false);
      setDescription("");
      setCustomAmount(booking.total_amount);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create payment request",
      });
    },
  });

  const handleAmountChange = (value: number[]) => {
    setCustomAmount(value[0]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Amount</Label>
            <div className="space-y-3">
              <Slider
                value={[customAmount]}
                onValueChange={handleAmountChange}
                max={maxAmount}
                min={1}
                step={100}
                className="w-full"
              />
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-4 w-4" />
                <Input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  max={maxAmount}
                  min={1}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Maximum: ₹{maxAmount.toLocaleString()} • Remaining: ₹{remainingAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Description (Optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this payment is for..."
              rows={3}
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium mb-2">Payment Preview</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Requested Amount:</span>
                <span className="font-medium">₹{customAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Type:</span>
                <span className="font-medium">
                  {customAmount >= maxAmount ? 'Final Payment' : 'Advance Payment'}
                </span>
              </div>
              {description && (
                <div className="pt-2">
                  <span className="font-medium">Description:</span>
                  <p className="text-muted-foreground mt-1">{description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => createPaymentRequest.mutate()}
              disabled={createPaymentRequest.isPending || customAmount > maxAmount}
            >
              {createPaymentRequest.isPending ? "Sending..." : "Send Payment Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};