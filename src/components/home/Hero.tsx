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
import Autoplay from "embla-carousel-autoplay";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, UserCog, Plus, Users, DollarSign, CheckSquare, AlertOctagon } from "lucide-react";
import AdditionalServiceForm from "@/components/service-provider/AdditionalServiceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const eventImages = [
  {
    url: "/lovable-uploads/b7933b51-98b2-45e4-ac01-f2424ed5e781.png",
    alt: "Traditional Indian Wedding Ceremony Offerings",
  },
  {
    url: "/lovable-uploads/4079e9c8-f79f-4bf9-a1f7-1aeeea1f9e30.png",
    alt: "Professional Wedding Photography Service",
  },
  {
    url: "/lovable-uploads/11ac3cd2-aa50-4a44-8bfd-e951d610fb7b.png",
    alt: "Traditional Hindu Baby Ceremony",
  },
  {
    url: "/lovable-uploads/8b5f264e-7ce3-4d42-b1bf-46a28d9b54ca.png",
    alt: "Traditional Mehndi Ceremony",
  }
];

const Hero = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { toast } = useToast();

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user profile",
        });
        return null;
      }
      return profile;
    },
    enabled: !!session?.user,
  });

  const { data: serviceProvider } = useQuery({
    queryKey: ["service-provider"],
    queryFn: async () => {
      if (!session?.user || userProfile?.user_type !== 'service_provider') return null;
      
      const { data, error } = await supabase
        .from("service_providers")
        .select("id, status")
        .eq("profile_id", session.user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch service provider details",
        });
        return null;
      }
      return data;
    },
    enabled: !!session?.user && userProfile?.user_type === 'service_provider',
  });

  const isAdmin = userProfile?.user_type === 'admin';
  const isServiceProvider = userProfile?.user_type === 'service_provider';
  const isVerifiedProvider = serviceProvider?.status === 'verified';

  const renderAdminDashboard = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">Active services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Verified providers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,231</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertOctagon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Button 
          size="lg"
          className="col-span-full w-full sm:w-auto bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white transition-all duration-300 transform hover:-translate-y-1 rounded-full shadow-lg border-2 border-ceremonial-gold"
          onClick={() => navigate("/admin")}
        >
          <Shield className="w-4 h-4 mr-2" />
          Go to Admin Dashboard
        </Button>
      </div>
    );
  };

  const renderServiceProviderDashboard = () => {
    if (!isVerifiedProvider) {
      return (
        <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          Your service provider account is pending verification. You'll be able to access your dashboard once verified.
        </div>
      );
    }

    return (
      <div className="space-y-6 w-full">
        <div className="relative w-full h-[40vh] overflow-hidden rounded-lg">
          <Carousel 
            plugins={[Autoplay({ delay: 5000 })]}
            className="w-full h-full"
          >
            <CarouselContent>
              {eventImages.map((image, index) => (
                <CarouselItem key={index} className="w-full h-full">
                  <div className="relative w-full h-full">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button 
            size="lg"
            className="w-full sm:w-auto bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white transition-all duration-300 transform hover:-translate-y-1 rounded-full shadow-lg border-2 border-ceremonial-gold"
            onClick={() => navigate("/dashboard")}
          >
            <UserCog className="w-4 h-4 mr-2" />
            Provider Dashboard
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white transition-all duration-300 transform hover:-translate-y-1 rounded-full shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Extra Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Additional Service</DialogTitle>
              </DialogHeader>
              {serviceProvider?.id && (
                <AdditionalServiceForm providerId={serviceProvider.id} />
              )}
            </DialogContent>
          </Dialog>
          <Button 
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-2 border-ceremonial-maroon text-ceremonial-maroon hover:bg-ceremonial-maroon hover:text-white transition-all duration-300 transform hover:-translate-y-1 rounded-full shadow-lg"
            onClick={() => navigate("/provider/profile")}
          >
            View Profile
          </Button>
        </div>
      </div>
    );
  };

  const renderRegularUserButtons = () => (
    <>
      <Button 
        size="lg"
        className="w-full sm:w-auto bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white transition-all duration-300 transform hover:-translate-y-1 rounded-full shadow-lg border-2 border-ceremonial-gold"
        onClick={() => navigate("/search")}
      >
        Find Services
      </Button>
      <Button 
        size="lg"
        variant="outline"
        className="w-full sm:w-auto border-2 border-ceremonial-maroon text-ceremonial-maroon hover:bg-ceremonial-maroon hover:text-white transition-all duration-300 transform hover:-translate-y-1 rounded-full shadow-lg"
        onClick={() => navigate("/profile")}
      >
        My Profile
      </Button>
    </>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 bg-white">
      <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        {!session && (
          <>
            <div className="absolute inset-0 z-10 flex items-center justify-center text-white text-center p-4">
              <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 leading-tight drop-shadow-lg">
                  Discover Sacred Traditions
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto font-body drop-shadow-lg">
                  Connect with expert ceremonial service providers for your most important occasions
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto bg-ceremonial-gold text-white border-2 border-ceremonial-gold transition-all duration-300 transform hover:-translate-y-1 hover:bg-ceremonial-gold/90 hover:border-ceremonial-gold/90 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg backdrop-blur-sm"
                    onClick={() => navigate("/search")}
                  >
                    Get an Estimate
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent border-2 border-ceremonial-gold text-white hover:bg-ceremonial-gold/10 hover:border-ceremonial-gold hover:text-white transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg backdrop-blur-sm"
                    onClick={() => navigate("/register/service-provider")}
                  >
                    Become a Provider
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute inset-0">
              <Carousel 
                plugins={[Autoplay({ delay: 5000 })]}
                className="w-full h-full"
              >
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
          </>
        )}
      </div>

      {session && (
        <div className="container mx-auto px-4 -mt-20 relative z-10 mb-12">
          <div className="bg-ceremonial-cream/95 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-xl border border-ceremonial-gold/20">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-ceremonial-maroon mb-6">
              Welcome Back
            </h2>
            <div className="flex flex-wrap gap-4">
              {isAdmin && renderAdminDashboard()}
              {isServiceProvider && renderServiceProviderDashboard()}
              {!isAdmin && !isServiceProvider && renderRegularUserButtons()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;