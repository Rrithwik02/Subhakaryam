import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface FavoriteButtonProps {
  providerId: string;
  initialIsFavorite?: boolean;
}

const FavoriteButton = ({ providerId, initialIsFavorite = false }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSessionContext();
  const { toast } = useToast();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("provider_id", providerId)
        .single();

      if (!error && data) {
        setIsFavorite(true);
      }
    };

    checkFavoriteStatus();
  }, [session, providerId]);

  const toggleFavorite = async () => {
    if (!session?.user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to favorite service providers",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", session.user.id)
          .eq("provider_id", providerId);

        if (error) throw error;

        toast({
          title: "Removed from favorites",
          description: "Service provider removed from your favorites",
        });
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({
            user_id: session.user.id,
            provider_id: providerId,
          });

        if (error) throw error;

        toast({
          title: "Added to favorites",
          description: "Service provider added to your favorites",
        });
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorites. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`transition-colors ${
        isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600"
      }`}
      onClick={toggleFavorite}
      disabled={isLoading}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
    </Button>
  );
};

export default FavoriteButton;