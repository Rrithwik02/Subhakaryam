import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { SecureAuthForm } from "@/components/auth/SecureAuthForm";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading } = useSessionContext();
  const [redirecting, setRedirecting] = useState(false);
  const [authMode, setAuthMode] = useState<"sign_in" | "sign_up">("sign_in");

  useEffect(() => {
    if (!session || redirecting) return;

    const checkUserTypeAndRedirect = async () => {
      try {
        setRedirecting(true);
        
        // Use the new admin function to avoid RLS recursion
        const { data: isAdminResult, error: adminError } = await supabase
          .rpc('is_user_admin' as any, { user_id: session.user.id });
        
        if (adminError) {
          // Continue with non-admin flow if admin check fails
        } else if (Boolean(isAdminResult)) {
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
        
        if (providerError && providerError.code !== 'PGRST116') {
          // Continue with regular user flow even if there's an error
        }
        
        if (provider) {
          navigate("/dashboard");
          toast({
            title: "Provider Login Successful",
            description: "Welcome to your service provider dashboard"
          });
        } else {
          navigate("/");
          toast({
            title: "Login Successful",
            description: "Welcome back!"
          });
        }
      } catch (error) {
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
        <SecureAuthForm
          mode={authMode}
          onModeChange={setAuthMode}
          redirectTo={`${window.location.origin}/auth/callback`}
        />
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
