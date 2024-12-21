import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading } = useSessionContext();

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  // Only show login form if user is not logged in
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
              }
            }}
            theme="light"
            providers={[]}
            redirectTo={`${window.location.origin}/`}
          />
        </Card>
      </div>
    );
  }

  return null;
};

export default Login;