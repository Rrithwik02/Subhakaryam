
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
        navigate("/");
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
