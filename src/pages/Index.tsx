
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

import SuggestionForm from "@/components/suggestions/SuggestionForm";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";
import AdvertCarousel from "@/components/home/AdvertCarousel";
import EssentialsPreview from "@/components/home/EssentialsPreview";
import Chatbot from "@/components/chat/Chatbot";
import FAQSchema from "@/components/seo/FAQSchema";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading } = useSessionContext();
  
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isServiceProvider, setIsServiceProvider] = React.useState(false);
  const [serviceProviderId, setServiceProviderId] = React.useState<string | null>(null);

  const { data: serviceProvider } = useQuery({
    queryKey: ["service-provider"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from("service_providers")
        .select("id")
        .eq("profile_id", session.user.id)
        .maybeSingle();

      // Handle PGRST116 error (no rows found) silently
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data;
    },
    enabled: !!session?.user,
    retry: false,
    meta: {
      onError: (error: any) => {
        
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check service provider status",
        });
      },
    },
  });

  useEffect(() => {
    const checkUserStatus = async () => {
      if (session?.user) {
        try {
          // Use the new admin function to avoid RLS recursion
          const { data: isAdminResult, error: adminError } = await supabase
            .rpc('is_user_admin' as any, { user_id: session.user.id });
          
          if (adminError) {
            
          } else {
            setIsAdmin(Boolean(isAdminResult));
          }

          const { data: providerData, error: providerError } = await supabase
            .from('service_providers')
            .select('id')
            .eq('profile_id', session.user.id)
            .maybeSingle();
          
          // Only log error if it's not a "no rows found" error
          if (providerError && providerError.code !== 'PGRST116') {
            
            return;
          }
          
          setIsServiceProvider(!!providerData);
          if (providerData) {
            setServiceProviderId(providerData.id);
          }
        } catch (error) {
          
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


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <FAQSchema />
      <Helmet>
        <title>Subhakaryam - Book Poojari & Ceremonial Services</title>
        <meta name="description" content="Discover and book trusted pooja services, mehendi artists, wedding photography, and more across major cities." />
        <link rel="canonical" href="/" />
      </Helmet>
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
