import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, AlertCircle, RefreshCw, Mail } from "lucide-react";

interface EmailConfirmationStatusProps {
  userEmail: string;
  onResendEmail: () => Promise<void>;
  isResending: boolean;
}

export const EmailConfirmationStatus = ({ 
  userEmail, 
  onResendEmail, 
  isResending 
}: EmailConfirmationStatusProps) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    try {
      await onResendEmail();
      setTimeLeft(60);
      setCanResend(false);
      toast({
        title: "Email Sent",
        description: "A new confirmation email has been sent to your inbox.",
      });
    } catch (error) {
      toast({
        title: "Failed to resend",
        description: "Unable to send confirmation email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const checkEmailProvider = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    const commonProviders = [
      { domains: ['gmail.com', 'googlemail.com'], name: 'Gmail', tips: 'Check your Promotions tab' },
      { domains: ['yahoo.com', 'yahoo.in'], name: 'Yahoo', tips: 'Check your Bulk/Spam folder' },
      { domains: ['outlook.com', 'hotmail.com', 'live.com'], name: 'Outlook', tips: 'Check your Junk folder' },
      { domains: ['rediffmail.com'], name: 'Rediff', tips: 'Check your Spam folder' },
      { domains: ['airtelmail.in'], name: 'Airtel', tips: 'Check your Spam folder' }
    ];

    return commonProviders.find(provider => 
      provider.domains.includes(domain)
    );
  };

  const emailProvider = checkEmailProvider(userEmail);

  return (
    <Card className="w-full max-w-md p-6 space-y-4">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-ceremonial-gold/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-ceremonial-gold" />
        </div>
        <h2 className="text-xl font-semibold text-ceremonial-maroon">
          Check Your Email
        </h2>
        <p className="text-sm text-gray-600">
          We've sent a confirmation email to:
        </p>
        <p className="font-medium text-ceremonial-maroon break-all">
          {userEmail}
        </p>
      </div>

      <div className="space-y-3">
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Click the confirmation link in your email to activate your account.
          </AlertDescription>
        </Alert>

        {emailProvider && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{emailProvider.name} users:</strong> {emailProvider.tips}
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <div>
              <strong>Email not in inbox?</strong> Try these steps:
            </div>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Check your spam/junk folder</li>
              <li>• Look in the promotions tab (Gmail)</li>
              <li>• Add noreply@subhakaryam.org to your contacts</li>
              <li>• Wait a few minutes for delivery</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleResend}
          disabled={!canResend || isResending}
          variant="outline"
          className="w-full"
        >
          {isResending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : canResend ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend Email
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 mr-2" />
              Resend in {timeLeft}s
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Still having trouble? Contact{" "}
            <a 
              href="mailto:support@subhakaryam.org" 
              className="text-ceremonial-gold hover:underline"
            >
              support@subhakaryam.org
            </a>
          </p>
        </div>
      </div>
    </Card>
  );
};