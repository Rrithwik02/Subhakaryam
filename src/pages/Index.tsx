
import React from "react";
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
  const { session } = useSessionContext();

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
        console.error('Error fetching user profile:', error);
        return null;
      }
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
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching service provider:', error);
        return null;
      }
      return data;
    },
    enabled: !!session?.user,
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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

  const renderDashboardButtons = () => {
    if (!session) {
      return (
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="shadow-lg border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
          <Button
            className="shadow-lg bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
            onClick={() => navigate("/register")}
          >
            Join Us
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-4">
        {userProfile?.user_type === 'admin' && (
          <Button
            className="shadow-lg bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white"
            onClick={() => navigate('/admin')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Dashboard
          </Button>
        )}
        
        {serviceProvider && (
          <Button
            className="shadow-lg bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
            onClick={() => navigate('/dashboard')}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Provider Dashboard
          </Button>
        )}
        
        <Button
          variant="outline"
          className="shadow-lg"
          onClick={() => navigate('/profile')}
        >
          <UserCog className="w-4 h-4 mr-2" />
          My Profile
        </Button>

        <Button
          variant="destructive"
          className="shadow-lg"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="absolute top-20 right-4 z-50">
        {renderDashboardButtons()}
      </div>

      <Hero />
      <AdvertCarousel />
      <Services />
      <EssentialsPreview />
      <HowItWorks />
      <Testimonials />
      
      {session && !serviceProvider && (
        <div className="max-w-md mx-auto px-4 py-12">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-full shadow-lg bg-ceremonial-gold hover:bg-ceremonial-gold/90"
              >
                <Plus className="w-4 h-4 mr-2" />
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
