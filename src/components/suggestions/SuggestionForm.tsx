import { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const suggestionSchema = z.object({
  type: z.string()
    .trim()
    .min(3, "Service type must be at least 3 characters")
    .max(50, "Service type must be less than 50 characters"),
  description: z.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
});

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

    // Validate input
    try {
      const validated = suggestionSchema.parse({ type, description });
      
      setIsSubmitting(true);
      const { error } = await supabase.from("service_suggestions").insert({
        user_id: session.user.id,
        suggestion_type: validated.type,
        description: validated.description,
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.issues[0].message,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Service Type</Label>
        <Input
          placeholder="What type of service are you looking for? (3-50 characters)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          maxLength={50}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Describe the service you'd like to see... (10-500 characters)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground">
          {description.trim().length}/500 characters
        </p>
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