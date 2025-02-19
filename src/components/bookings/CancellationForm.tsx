
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CancellationFormProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  paymentAmount?: number;
  paymentType?: string;
  onCancellationComplete: () => void;
}

const CancellationForm = ({
  isOpen,
  onClose,
  bookingId,
  paymentAmount,
  paymentType,
  onCancellationComplete,
}: CancellationFormProps) => {
  const { toast } = useToast();
  const [reason, setReason] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      
      onCancellationComplete();
      onClose();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {paymentAmount > 0 && (
            <div>
              <p className="text-sm text-gray-600">
                Payment Information:
              </p>
              <p className="font-medium">
                Amount Paid: ₹{paymentAmount}
              </p>
              <p className="text-sm text-gray-600">
                Payment Type: {paymentType}
              </p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reason for Cancellation
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for cancellation"
              className="mt-1"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" variant="destructive">
              Confirm Cancellation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CancellationForm;
