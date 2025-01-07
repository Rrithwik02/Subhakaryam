import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HeroCarousel from "./HeroCarousel";
import HeroContent from "./HeroContent";
import QuickActions from "./QuickActions";

const Hero = () => {
  const { session } = useSessionContext();

  const { data: serviceProvider } = useQuery({
    queryKey: ["service-provider"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from("service_providers")
        .select("id")
        .eq("profile_id", session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!session?.user,
  });
  
  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 bg-royal-bg">
      <div className="relative w-full h-[70vh] overflow-hidden">
        <HeroContent isAuthenticated={!!session} />
        <HeroCarousel />
      </div>

      {session && (
        <QuickActions isServiceProvider={!!serviceProvider} />
      )}
    </div>
  );
};

export default Hero;