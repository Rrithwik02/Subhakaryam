
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
import { Card } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSessionContext();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["user-profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      return profile;
    },
    enabled: !!session?.user,
  });

  const { data: serviceProvider } = useQuery({
    queryKey: ["service-provider", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("profile_id", session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching service provider:', error);
        throw error;
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

  const DashboardSection = () => {
    if (!session) return null;

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="bg-white p-6 rounded-lg shadow-lg">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-ceremonial-maroon">Dashboard Access</h2>
            <div className="flex flex-wrap gap-4">
              {userProfile?.user_type === 'admin' && (
                <Button
                  className="bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white"
                  onClick={() => navigate('/admin')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              )}
              
              {serviceProvider && (
                <Button
                  className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
                  onClick={() => navigate('/dashboard')}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Provider Dashboard
                </Button>
              )}
              
              <Button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={() => navigate('/profile')}
              >
                <UserCog className="w-4 h-4 mr-2" />
                My Profile
              </Button>

              <Button
                variant="destructive"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
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
      <Hero />
      <DashboardSection />
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
                className="w-full shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff] bg-ceremonial-gold hover:bg-ceremonial-gold/90"
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
