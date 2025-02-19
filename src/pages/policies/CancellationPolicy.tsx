
import { XOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const CancellationPolicy = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancellation = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('account_deletion_requests')
        .insert([
          { user_id: session.user.id, reason: 'User requested cancellation', status: 'pending' }
        ]);

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your cancellation request has been submitted and will be processed within 48 hours.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit cancellation request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <XOctagon className="h-8 w-8 text-ceremonial-maroon" />
          <h1 className="text-4xl font-display font-bold text-ceremonial-maroon">
            Cancellation Policy
          </h1>
        </div>
        <div className="prose max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Booking Cancellations</h2>
          <ul>
            <li>Cancellation more than 72 hours before: Full refund</li>
            <li>48-72 hours before: 75% refund</li>
            <li>24-48 hours before: 50% refund</li>
            <li>Less than 24 hours: No refund</li>
          </ul>

          <h2>How to Cancel a Booking</h2>
          <ol>
            <li>Log into your account</li>
            <li>Go to "My Bookings"</li>
            <li>Select the booking you wish to cancel</li>
            <li>Click the "Cancel Booking" button</li>
            <li>Provide cancellation reason (optional)</li>
          </ol>

          <h2>Service Provider Cancellations</h2>
          <p>If a service provider cancels:</p>
          <ul>
            <li>Full refund guaranteed</li>
            <li>Assistance in finding alternative provider</li>
            <li>Additional compensation for inconvenience</li>
          </ul>

          <h2>Account Cancellation</h2>
          <p>To permanently delete your account and data:</p>
          {session && (
            <div className="my-4">
              <Button
                variant="destructive"
                onClick={handleCancellation}
                disabled={isLoading}
              >
                Request Account Deletion
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Note: Account deletion is permanent and cannot be undone. All your data will be removed within 48 hours of approval.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
