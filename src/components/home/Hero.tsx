import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return profile;
    },
    enabled: !!session?.user,
  });

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
    <section className="hero-pattern py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-ceremonial-gold mb-2">
            Subhakaryam
          </h1>
          <p className="text-ceremonial-maroon text-sm font-medium mt-4">
            Celebrating Sacred Traditions
          </p>
        </div>
        <h2 className="text-5xl md:text-6xl font-display font-bold text-ceremonial-maroon mb-6">
          Sacred Ceremonies Made Simple
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Book all your ceremonial services in one place. From poojas to weddings, we've got you covered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {!session ? (
            // Not logged in - show register options
            <>
              <Button 
                className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white px-8 py-6 text-lg order-1 sm:order-1 transform hover:scale-105 transition-transform shadow-lg"
                onClick={() => navigate("/register")}
              >
                Register as Guest
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-ceremonial-maroon text-ceremonial-maroon hover:bg-ceremonial-maroon hover:text-white px-8 py-6 text-lg order-2 sm:order-2"
                onClick={() => navigate("/register/service-provider")}
              >
                Join as Service Provider
              </Button>
            </>
          ) : serviceProvider ? (
            // Logged in as service provider
            <>
              <Button 
                className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white px-8 py-6 text-lg transform hover:scale-105 transition-transform shadow-lg"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-ceremonial-maroon text-ceremonial-maroon hover:bg-ceremonial-maroon hover:text-white px-8 py-6 text-lg"
                onClick={() => navigate("/provider/profile")}
              >
                View Profile
              </Button>
            </>
          ) : (
            // Logged in as regular user
            <>
              <Button 
                className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white px-8 py-6 text-lg transform hover:scale-105 transition-transform shadow-lg"
                onClick={() => navigate("/search")}
              >
                Search Services
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-ceremonial-maroon text-ceremonial-maroon hover:bg-ceremonial-maroon hover:text-white px-8 py-6 text-lg"
                onClick={() => navigate("/profile")}
              >
                View Profile
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;