import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ServiceSelection } from "./ServiceSelection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdditionalServiceFormProps {
  providerId: string;
  open: boolean;
  onClose: () => void;
}

const AdditionalServiceForm = ({ providerId, open, onClose }: AdditionalServiceFormProps) => {
  const { toast } = useToast();
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("additional_services").insert({
        provider_id: providerId,
        service_type: serviceType,
        description,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your additional service has been submitted for review.",
      });

      setServiceType("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error submitting additional service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit additional service. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-ceremonial-maroon text-center">
            Add Additional Service
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <ServiceSelection 
            onServiceChange={setServiceType} 
            className="space-y-2"
          />
          
          <div className="space-y-2">
            <Label className="text-gray-700">Description</Label>
            <Textarea
              placeholder="Describe the additional service you'd like to offer..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[120px] resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Additional Service"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdditionalServiceForm;