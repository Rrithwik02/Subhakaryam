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

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(data?.user_type === 'admin');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(data?.user_type === 'admin');
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Buttons */}
      <div className="absolute top-4 right-4 flex gap-4">
        <div className="flex gap-2">
          {isAuthenticated ? (
            <>
              <Button
                variant="outline"
                className="border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white"
                onClick={() => navigate("/search")}
              >
                Search Services
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  className="border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white"
                  onClick={() => navigate("/admin")}
                >
                  Admin Dashboard
                </Button>
              )}
              <Button
                className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
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
      <Footer />
    </div>
  );
};

export default Index;