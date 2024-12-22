import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserCog } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import SuggestionForm from "@/components/suggestions/SuggestionForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSessionContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isServiceProvider, setIsServiceProvider] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (session?.user) {
        // Check admin status
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Error checking user status:', profileError);
          return;
        }
        
        setIsAdmin(profileData?.user_type === 'admin');

        // Check service provider status
        const { data: providerData, error: providerError } = await supabase
          .from('service_providers')
          .select('id')
          .eq('profile_id', session.user.id)
          .maybeSingle();
        
        if (providerError) {
          console.error('Error checking provider status:', providerError);
          return;
        }
        
        setIsServiceProvider(!!providerData);
      }
    };

    checkUserStatus();
  }, [session]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 flex gap-4 z-50">
        <div className="flex gap-2">
          {session ? (
            <>
              <Button
                variant="outline"
                className="border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white backdrop-blur-md bg-white/30"
                onClick={() => navigate("/search")}
              >
                Search Services
              </Button>
              
              {isServiceProvider && (
                <Button
                  variant="outline"
                  className="border-ceremonial-maroon text-ceremonial-maroon hover:bg-ceremonial-maroon hover:text-white backdrop-blur-md bg-white/30 flex items-center gap-2"
                  onClick={() => navigate("/dashboard")}
                >
                  <UserCog className="w-4 h-4" />
                  Provider Dashboard
                </Button>
              )}
              
              {isAdmin && (
                <Button
                  variant="outline"
                  className="border-ceremonial-maroon text-ceremonial-maroon hover:bg-ceremonial-maroon hover:text-white backdrop-blur-md bg-white/30 flex items-center gap-2"
                  onClick={() => navigate("/admin")}
                >
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Button>
              )}
              
              <Button
                className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white backdrop-blur-md"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white backdrop-blur-md bg-white/30"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white backdrop-blur-md"
                onClick={() => navigate("/register")}
              >
                Join Us
              </Button>
            </>
          )}
        </div>
      </div>

      <Hero />
      <Services />
      <HowItWorks />
      <Testimonials />
      
      {session && (
        <div className="max-w-md mx-auto px-4 py-12">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
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
      
      <Footer />
    </div>
  );
};

export default Index;