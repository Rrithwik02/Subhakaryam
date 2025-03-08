
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        // Check if the user is a service provider
        const checkUserTypeAndRedirect = async () => {
          try {
            console.log("Auth state changed. User signed in:", session?.user.id);
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("user_type")
              .eq("id", session?.user.id)
              .single();
            
            console.log("Profile data:", profile, error);
            
            if (error) throw error;
            
            if (profile?.user_type === 'admin') {
              navigate("/admin");
              toast({
                title: "Admin Login Successful",
                description: "Welcome to your admin dashboard"
              });
            } else {
              // Check if the user is a service provider
              const { data: provider, error: providerError } = await supabase
                .from("service_providers")
                .select("id")
                .eq("profile_id", session?.user.id)
                .maybeSingle();
              
              console.log("Provider data:", provider, providerError);
              
              if (providerError && providerError.code !== 'PGRST116') {
                throw providerError;
              }
              
              if (provider) {
                navigate("/dashboard");
                toast({
                  title: "Provider Registration Complete",
                  description: "Welcome to your service provider dashboard"
                });
              } else {
                toast({
                  title: "Welcome!",
                  description: "Your account has been created successfully.",
                });
                navigate("/");
              }
            }
          } catch (error) {
            console.error("Error checking user type:", error);
            toast({
              title: "Welcome!",
              description: "Your account has been created successfully.",
            });
            navigate("/");
          }
        };
        
        checkUserTypeAndRedirect();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 mb-6">Join our community today</p>
        </div>
        
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
              divider: 'my-6',
            }
          }}
          theme="light"
          providers={["google"]}
          view="sign_up"
        />

        <div className="text-center pt-4 border-t">
          <span className="text-gray-600">Are you a service provider?</span>{" "}
          <Button
            variant="link"
            className="text-ceremonial-maroon hover:text-ceremonial-maroon/90 p-0"
            onClick={() => navigate("/register/service-provider")}
          >
            Register here
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Register;
