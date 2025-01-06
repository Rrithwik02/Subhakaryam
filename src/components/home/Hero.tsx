import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

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
    <div className="min-h-[calc(100vh-4rem)] pt-16 bg-ceremonial-cream">
      {/* Main Hero Banner */}
      <div className="relative w-full h-[50vh] bg-gradient-to-r from-ceremonial-maroon to-ceremonial-gold overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Sacred Ceremonies Made Simple
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Book all your ceremonial services in one place
            </p>
            {!session ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-white text-ceremonial-maroon hover:bg-gray-100"
                  onClick={() => navigate("/register")}
                >
                  Join Now
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate("/register/service-provider")}
                >
                  Become a Provider
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Featured Categories Grid */}
      <div className="container mx-auto px-4 -mt-20 relative z-10 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
              Pooja Services
            </h3>
            <p className="text-gray-600 mb-4">
              Traditional poojas performed by experienced priests
            </p>
            <Button 
              variant="outline"
              className="w-full border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white"
              onClick={() => navigate("/search?service=pooja")}
            >
              Explore
            </Button>
          </Card>

          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
              Wedding Services
            </h3>
            <p className="text-gray-600 mb-4">
              Complete wedding planning and ceremonial services
            </p>
            <Button 
              variant="outline"
              className="w-full border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white"
              onClick={() => navigate("/search?service=wedding")}
            >
              Plan Now
            </Button>
          </Card>

          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
              Special Events
            </h3>
            <p className="text-gray-600 mb-4">
              Customized services for all special occasions
            </p>
            <Button 
              variant="outline"
              className="w-full border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white"
              onClick={() => navigate("/search")}
            >
              View All
            </Button>
          </Card>
        </div>
      </div>

      {/* Quick Actions for Logged In Users */}
      {session && (
        <div className="container mx-auto px-4 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-display font-bold text-ceremonial-maroon mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              {serviceProvider ? (
                <>
                  <Button 
                    className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
                    onClick={() => navigate("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-ceremonial-maroon text-ceremonial-maroon hover:bg-ceremonial-maroon hover:text-white"
                    onClick={() => navigate("/provider/profile")}
                  >
                    View Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
                    onClick={() => navigate("/search")}
                  >
                    Book Services
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-ceremonial-maroon text-ceremonial-maroon hover:bg-ceremonial-maroon hover:text-white"
                    onClick={() => navigate("/profile")}
                  >
                    My Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;