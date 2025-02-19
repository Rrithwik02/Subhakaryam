
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Shield, UserCog, Plus, LogOut, Briefcase } from "lucide-react";
import SuggestionForm from "@/components/suggestions/SuggestionForm";
import AdditionalServiceForm from "@/components/service-provider/AdditionalServiceForm";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";
import AdvertCarousel from "@/components/home/AdvertCarousel";
import EssentialsPreview from "@/components/home/EssentialsPreview";
import Chatbot from "@/components/chat/Chatbot";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading } = useSessionContext();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isServiceProvider, setIsServiceProvider] = React.useState(false);
  const [serviceProviderId, setServiceProviderId] = React.useState<string | null>(null);

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user profile:', error);
          return null;
        }

        return profile;
      } catch (error) {
        console.error('Error in user profile query:', error);
        return null;
      }
    },
    enabled: !!session?.user,
    retry: false
  });

  const { data: serviceProvider } = useQuery({
    queryKey: ["service-provider"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      try {
        const { data, error } = await supabase
          .from("service_providers")
          .select("id")
          .eq("profile_id", session.user.id)
          .maybeSingle();

        if (error) {
          // Don't throw for "no rows" error
          if (error.code === 'PGRST116') {
            return null;
          }
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Error in service provider query:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check service provider status",
        });
        return null;
      }
    },
    enabled: !!session?.user,
    retry: false
  });

  useEffect(() => {
    const checkUserStatus = async () => {
      if (session?.user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error('Error checking user status:', profileError);
            return;
          }
          
          setIsAdmin(profileData?.user_type === 'admin');

          const { data: providerData, error: providerError } = await supabase
            .from('service_providers')
            .select('id')
            .eq('profile_id', session.user.id)
            .maybeSingle();
          
          if (providerError && providerError.code !== 'PGRST116') {
            console.error('Error checking provider status:', providerError);
            return;
          }
          
          setIsServiceProvider(!!providerData);
          if (providerData) {
            setServiceProviderId(providerData.id);
          }
        } catch (error) {
          console.error('Error in checkUserStatus:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to check user status",
          });
        }
      }
    };

    checkUserStatus();
  }, [session, toast]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.clear();
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="absolute top-20 right-4 flex gap-4 z-50">
        <div className="flex gap-2">
          {session ? (
            <Button
              className="shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff] bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white backdrop-blur-md flex items-center gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff] border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white backdrop-blur-md bg-white/30"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                className="shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff] bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white backdrop-blur-md"
                onClick={() => navigate("/register")}
              >
                Join Us
              </Button>
            </>
          )}
        </div>
      </div>

      <Hero />
      <AdvertCarousel />
      <Services />
      <EssentialsPreview />
      <HowItWorks />
      <Testimonials />
      
      {session && !isServiceProvider && (
        <div className="max-w-md mx-auto px-4 py-12">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-full shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff] bg-ceremonial-gold hover:bg-ceremonial-gold/90"
              >
                Suggest a Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suggest a Service</DialogTitle>
              </DialogHeader>
              <SuggestionForm />
            </DialogContent>
          </Dialog>
        </div>
      )}
      
      <Chatbot />
      <Footer />
    </div>
  );
};

export default Index;
