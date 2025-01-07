import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const eventImages = [
  {
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    alt: "Traditional Indian wedding ceremony",
  },
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
    alt: "Elegant catering setup",
  },
  {
    url: "https://images.unsplash.com/photo-1509264279362-c1b418e7e91d",
    alt: "Bridal mehendi ceremony",
  },
  {
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
    alt: "Professional makeup session",
  },
];

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
    <div className="min-h-[calc(100vh-4rem)] pt-16 bg-[#1A1F2C]">
      {/* Main Hero Banner */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <div className="absolute inset-0 z-10 flex items-center justify-center text-white text-center p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-6 leading-tight text-[#D6BCFA]">
              Discover Sacred Traditions
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-body text-[#9b87f5]/90">
              Connect with expert ceremonial service providers for your most important occasions
            </p>
            {!session ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-[#8B5CF6] text-white hover:bg-[#7E69AB] transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg"
                  onClick={() => navigate("/search")}
                >
                  Get an Estimate
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#D6BCFA] text-[#D6BCFA] hover:bg-[#D6BCFA] hover:text-[#1A1F2C] transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full backdrop-blur-sm"
                  onClick={() => navigate("/register/service-provider")}
                >
                  Become a Provider
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Event Images Carousel */}
        <div className="absolute inset-0">
          <Carousel className="w-full h-full" opts={{ loop: true, duration: 10000 }}>
            <CarouselContent>
              {eventImages.map((image, index) => (
                <CarouselItem key={index} className="w-full h-full">
                  <div className="relative w-full h-full">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Quick Actions for Logged In Users */}
      {session && (
        <div className="container mx-auto px-4 -mt-20 relative z-10 mb-12">
          <div className="bg-[#1A1F2C]/95 backdrop-blur-md p-8 rounded-lg shadow-xl border border-[#D6BCFA]/20">
            <h2 className="text-2xl font-display font-bold text-[#D6BCFA] mb-6">
              Welcome Back
            </h2>
            <div className="flex flex-wrap gap-4">
              {serviceProvider ? (
                <>
                  <Button 
                    size="lg"
                    className="bg-[#8B5CF6] hover:bg-[#7E69AB] text-white transition-all duration-300 transform hover:-translate-y-1 rounded-full shadow-lg"
                    onClick={() => navigate("/dashboard")}
                  >
                    Provider Dashboard
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#D6BCFA] text-[#D6BCFA] hover:bg-[#D6BCFA] hover:text-[#1A1F2C] transition-all duration-300 transform hover:-translate-y-1 rounded-full"
                    onClick={() => navigate("/provider/profile")}
                  >
                    View Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg"
                    className="bg-[#8B5CF6] hover:bg-[#7E69AB] text-white transition-all duration-300 transform hover:-translate-y-1 rounded-full shadow-lg"
                    onClick={() => navigate("/search")}
                  >
                    Find Services
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#D6BCFA] text-[#D6BCFA] hover:bg-[#D6BCFA] hover:text-[#1A1F2C] transition-all duration-300 transform hover:-translate-y-1 rounded-full"
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