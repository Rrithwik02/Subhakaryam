
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading } = useSessionContext();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!session || redirecting) return;

    const checkUserTypeAndRedirect = async () => {
      try {
        setRedirecting(true);
        console.log("Checking user type for:", session.user.id);
        
        // First check user profile to determine user type
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }
        
        console.log("User profile:", profile);
        
        if (profile?.user_type === 'admin') {
          console.log("User is admin - redirecting to /admin");
          navigate("/admin");
          toast({
            title: "Admin Login Successful",
            description: "Welcome to your admin dashboard"
          });
          return;
        }
        
        // Check if user is a service provider
        const { data: provider, error: providerError } = await supabase
          .from("service_providers")
          .select("id")
          .eq("profile_id", session.user.id)
          .maybeSingle();
        
        console.log("Provider check result:", provider, providerError);
        
        if (providerError && providerError.code !== 'PGRST116') {
          console.error("Error checking provider status:", providerError);
          throw providerError;
        }
        
        if (provider) {
          console.log("User is a service provider - redirecting to /dashboard");
          navigate("/dashboard");
          toast({
            title: "Provider Login Successful",
            description: "Welcome to your service provider dashboard"
          });
        } else {
          console.log("User is a regular user - redirecting to /");
          navigate("/");
          toast({
            title: "Login Successful",
            description: "Welcome back!"
          });
        }
      } catch (error) {
        console.error("Error in checkUserTypeAndRedirect:", error);
        navigate("/");
        toast({
          title: "Login Successful",
          description: "Welcome back!"
        });
      } finally {
        setRedirecting(false);
      }
    };
    
    checkUserTypeAndRedirect();
  }, [session, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 mb-6">Sign in to your account</p>
          </div>

          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="user" className="text-ceremonial-maroon data-[state=active]:bg-ceremonial-cream">
                Regular User
              </TabsTrigger>
              <TabsTrigger value="provider" className="text-ceremonial-maroon data-[state=active]:bg-ceremonial-cream">
                Service Provider
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user">
              <div className="space-y-4">
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#B8860B',
                          brandAccent: '#966F08',
                        }
                      }
                    },
                    className: {
                      container: 'w-full',
                      button: 'w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white',
                      divider: 'my-4',
                    }
                  }}
                  theme="light"
                  providers={["google"]}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="provider">
              <div className="space-y-4">
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#B8860B',
                          brandAccent: '#966F08',
                        }
                      }
                    },
                    className: {
                      container: 'w-full',
                      button: 'w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white',
                      divider: 'my-4',
                    }
                  }}
                  theme="light"
                  providers={["google"]}
                />
                <div className="mt-4 p-4 bg-ceremonial-cream/50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    Note: You'll be redirected to complete your provider profile after authentication.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    );
  }

  // If session exists but we're not redirecting yet, show loading
  return (
    <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
    </div>
  );
};

export default Login;
