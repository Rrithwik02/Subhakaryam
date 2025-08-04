import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Loader2 } from "lucide-react";

interface PaymentRequestButtonProps {
  bookingId: string;
  amount: number;
  paymentType: 'advance' | 'final';
  description?: string;
  onPaymentSuccess?: () => void;
}

const PaymentRequestButton = ({ 
  bookingId, 
  amount, 
  paymentType, 
  description,
  onPaymentSuccess 
}: PaymentRequestButtonProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Call the create-razorpay-checkout function
      const { data, error } = await supabase.functions.invoke('create-razorpay-checkout', {
        body: {
          bookingId,
          paymentType,
          amount
        }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Redirect to Razorpay payment page
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={isProcessing}
      className="w-full"
      size="sm"
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Pay ₹{amount.toLocaleString()}
        </>
      )}
    </Button>
  );
};

export default PaymentRequestButton;