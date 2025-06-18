import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
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
        
        // Use the new admin function to avoid RLS recursion
        const { data: isAdminResult, error: adminError } = await supabase
          .rpc('is_user_admin', { user_id: session.user.id });
        
        console.log("Admin check result:", isAdminResult);
        
        if (adminError) {
          console.error("Error checking admin status:", adminError);
          // Continue with non-admin flow if admin check fails
        } else if (isAdminResult) {
          console.log("User is admin - redirecting to /admin");
          navigate("/admin");
          toast({
            title: "Admin Login Successful",
            description: "Welcome to your admin dashboard"
          });
          return;
        }
        
        // Check if user is a service provider - using direct query with error handling
        const { data: provider, error: providerError } = await supabase
          .from("service_providers")
          .select("id")
          .eq("profile_id", session.user.id)
          .maybeSingle();
        
        console.log("Provider check result:", provider);
        
        if (providerError && providerError.code !== 'PGRST116') {
          console.error("Error checking provider status:", providerError);
          // Continue with regular user flow even if there's an error
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
              view="sign_in"
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Email address",
                    password_label: "Password",
                    button_label: "Sign in",
                    loading_button_label: "Signing in...",
                    social_provider_text: "Sign in with {{provider}}",
                    link_text: "Already have an account? Sign in"
                  }
                }
              }}
              showLinks={false}
            />
          </div>

          <div className="mt-4 p-4 bg-ceremonial-cream/50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Note: You'll be redirected to complete your provider profile after authentication.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
    </div>
  );
};

export default Login;
