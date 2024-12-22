import { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SuggestionForm = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to submit suggestions",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("service_suggestions").insert({
      user_id: session.user.id,
      suggestion_type: type,
      description,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit suggestion",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Your suggestion has been submitted",
    });

    setType("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Service Type</Label>
        <Input
          placeholder="What type of service are you looking for?"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Describe the service you'd like to see..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Suggestion"}
      </Button>
    </form>
  );
};

export default SuggestionForm;