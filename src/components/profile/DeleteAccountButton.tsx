
import { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const DeleteAccountButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { session } = useSessionContext();
  const { toast } = useToast();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("account_deletion_requests")
        .insert({
          user_id: session.user.id,
          reason,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your account deletion request has been submitted. An admin will review it shortly.",
      });
      setIsOpen(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit account deletion request. Please try again.",
      });
    },
  });

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        Delete Account
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone
              once approved by an admin.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Please tell us why you're leaving (optional):
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Your feedback helps us improve our services"
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteAccountMutation.mutate()}
            >
              Request Deletion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteAccountButton;
