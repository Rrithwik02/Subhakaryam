import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading } = useSessionContext();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

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
        <Card className="w-full max-w-md p-6 space-y-6 bg-white">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 mb-6">Sign in to your account</p>
          </div>

          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="user">Regular User</TabsTrigger>
              <TabsTrigger value="provider">Service Provider</TabsTrigger>
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
                      label: 'text-sm font-medium text-gray-700',
                      input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ceremonial-gold/50 focus:border-ceremonial-gold',
                      message: 'text-sm text-red-500',
                    }
                  }}
                  theme="light"
                  providers={["google"]}
                  redirectTo={`${window.location.origin}/`}
                  onlyThirdPartyProviders={false}
                />
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    New user?{" "}
                    <Button
                      variant="link"
                      className="text-ceremonial-maroon hover:text-ceremonial-maroon/90 p-0"
                      onClick={() => navigate("/register")}
                    >
                      Create an account
                    </Button>
                  </p>
                </div>
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
                      label: 'text-sm font-medium text-gray-700',
                      input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ceremonial-gold/50 focus:border-ceremonial-gold',
                      message: 'text-sm text-red-500',
                    }
                  }}
                  theme="light"
                  providers={["google"]}
                  redirectTo={`${window.location.origin}/dashboard`}
                  onlyThirdPartyProviders={false}
                />
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Want to offer services?{" "}
                    <Button
                      variant="link"
                      className="text-ceremonial-maroon hover:text-ceremonial-maroon/90 p-0"
                      onClick={() => navigate("/register/service-provider")}
                    >
                      Register as provider
                    </Button>
                  </p>
                </div>
                <div className="mt-4 p-4 bg-ceremonial-cream/50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    Note: If you clicked "Register as provider", please sign in first. 
                    You'll be redirected to complete your provider profile after authentication.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    );
  }

  return null;
};

export default Login;