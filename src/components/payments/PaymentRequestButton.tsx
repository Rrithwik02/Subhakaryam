import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error('Failed to load Razorpay script');
        }
      }

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

      if (!data?.orderId || !data?.keyId) {
        throw new Error('Invalid payment data received');
      }

      // Initialize Razorpay payment
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Subhakaryam',
        description: description || `${paymentType} payment`,
        order_id: data.orderId,
        handler: function (response: any) {
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully.",
          });
          onPaymentSuccess?.();
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
      });
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