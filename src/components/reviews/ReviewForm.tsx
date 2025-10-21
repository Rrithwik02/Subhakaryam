import { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().int().min(1, "Please select a rating").max(5),
  comment: z.string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must be less than 500 characters"),
});

interface ReviewFormProps {
  providerId: string;
  onSuccess?: () => void;
}

const ReviewForm = ({ providerId, onSuccess }: ReviewFormProps) => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to submit a review",
      });
      return;
    }

    // Validate input
    try {
      const validated = reviewSchema.parse({ rating, comment });
      
      setIsSubmitting(true);
      const { error } = await supabase.from("reviews").insert({
        provider_id: providerId,
        user_id: session.user.id,
        rating: validated.rating,
        comment: validated.comment,
      });

      setIsSubmitting(false);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to submit review",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Your review has been submitted for approval",
      });

      setRating(0);
      setComment("");
      onSuccess?.();
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
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                value <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Share your experience... (10-500 characters)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        rows={4}
        maxLength={500}
      />
      <p className="text-xs text-muted-foreground">
        {comment.trim().length}/500 characters
      </p>
      <Button
        type="submit"
        className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
        disabled={isSubmitting || rating === 0}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default ReviewForm;