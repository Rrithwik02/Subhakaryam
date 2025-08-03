import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          toast({
            title: "Authentication Error",
            description: "There was an issue confirming your email. Please try again.",
            variant: "destructive",
          });
          navigate("/auth/login");
          return;
        }

        if (data.session) {
          toast({
            title: "Email Confirmed!",
            description: "Your account has been successfully verified.",
          });
          
          // Check user type and redirect accordingly
          const { data: profile } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", data.session.user.id)
            .single();

          if (profile?.user_type === 'admin') {
            navigate("/admin");
          } else {
            const { data: provider } = await supabase
              .from("service_providers")
              .select("id")
              .eq("profile_id", data.session.user.id)
              .maybeSingle();

            if (provider) {
              navigate("/dashboard");
            } else {
              navigate("/");
            }
          }
        } else {
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Unexpected error in auth callback:", error);
        navigate("/auth/login");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ceremonial-gold mx-auto"></div>
        <h2 className="text-xl font-semibold text-ceremonial-maroon">
          Confirming your email...
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your account.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;