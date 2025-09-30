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
  const [authMode, setAuthMode] = useState<"sign_in" | "sign_up">("sign_in");
  const [checkingRedirect, setCheckingRedirect] = useState(false);

  useEffect(() => {
    if (isLoading) {
      console.log("⏳ Session is still loading...");
      return;
    }

    console.log("🔑 Session state:", session);

    if (!session) {
      console.log("❌ No active session, showing login form.");
      return; // Stay on login page
    }

    const checkUserTypeAndRedirect = async () => {
      try {
        setCheckingRedirect(true);

        // Check admin status via RPC
        const { data: isAdminResult, error: adminError } = await supabase.rpc(
          "is_user_admin" as any,
          { user_id: session.user.id }
        );

        if (adminError) {
          console.warn("⚠️ Admin check error:", adminError.message);
        } else if (Boolean(isAdminResult)) {
          console.log("✅ User is admin, redirecting to /admin");
          navigate("/admin", { replace: true });
          toast({
            title: "Admin Login Successful",
            description: "Welcome to your admin dashboard",
          });
          return;
        }

        // Check if user is a service provider
        const { data: provider, error: providerError } = await supabase
          .from("service_providers")
          .select("id")
          .eq("profile_id", session.user.id)
          .maybeSingle();

        if (providerError && providerError.code !== "PGRST116") {
          console.warn("⚠️ Provider check error:", providerError.message);
        }

        if (provider) {
          console.log("✅ User is a service provider, redirecting to /dashboard");
          navigate("/dashboard", { replace: true });
          toast({
            title: "Provider Login Successful",
            description: "Welcome to your service provider dashboard",
          });
        } else {
          console.log("✅ Regular user, redirecting to home /");
          navigate("/", { replace: true });
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
        }
      } catch (err) {
        console.error("❌ Unexpected error during login redirect:", err);
        navigate("/", { replace: true });
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      } finally {
        setCheckingRedirect(false);
      }
    };

    checkUserTypeAndRedirect();
  }, [session, isLoading, navigate, toast]);

  // Loading while checking session
  if (isLoading || checkingRedirect) {
    return (
      <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  // No session → show login form
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

  // Already logged in but waiting for redirect
  return (
    <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
    </div>
  );
};

export default Login;
