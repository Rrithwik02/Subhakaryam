import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ServiceSelection } from "./ServiceSelection";

interface AdditionalServiceFormProps {
  providerId: string;
}

const AdditionalServiceForm = ({ providerId }: AdditionalServiceFormProps) => {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <ServiceSelection onServiceChange={setServiceType} />
      
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Describe the additional service you'd like to offer..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Additional Service"}
      </Button>
    </form>
  );
};

export default AdditionalServiceForm;