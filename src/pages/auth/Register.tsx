
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmailConfirmationStatus } from "@/components/auth/EmailConfirmationStatus";
import CustomRegistrationForm from "@/components/auth/CustomRegistrationForm";
import { Button } from "@/components/ui/button";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [redirecting, setRedirecting] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      
      
      if (event === "SIGNED_IN" && session && !session.user.email_confirmed_at) {
        setUserEmail(session?.user?.email || "");
        setShowEmailConfirmation(true);
        toast({
          title: "Registration Successful!",
          description: "Please check your email to confirm your account.",
        });
        return;
      }
      
      if (event === "SIGNED_IN" && !redirecting) {
        // Check if the user is a service provider
        const checkUserTypeAndRedirect = async () => {
          try {
            setRedirecting(true);
            
            const { data: isAdmin, error } = await supabase.rpc(
              'is_user_admin',
              { user_id: session?.user.id }
            );
            
            if (error) throw error;
            
            if (isAdmin) {
              navigate("/admin");
              toast({
                title: "Admin Login Successful",
                description: "Welcome to your admin dashboard"
              });
              return;
            }
            
            // Check if the user is a service provider
            const { data: provider, error: providerError } = await supabase
              .from("service_providers")
              .select("id")
              .eq("profile_id", session?.user.id)
              .maybeSingle();
            
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
          } catch (error) {
            toast({
              title: "Welcome!",
              description: "Your account has been created successfully.",
            });
            navigate("/");
          } finally {
            setRedirecting(false);
          }
        };
        
        checkUserTypeAndRedirect();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      
      // Try to resend using custom edge function first
      const { error: customError } = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          email: userEmail,
          confirmationUrl: `${window.location.origin}/auth/callback`,
          type: 'confirmation'
        }
      });

      if (customError) {
        // Fallback to Supabase built-in resend
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: userEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        
        if (error) throw error;
      }
    } catch (error: any) {
      
      throw error;
    } finally {
      setIsResending(false);
    }
  };

  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
        <EmailConfirmationStatus
          userEmail={userEmail}
          onResendEmail={handleResendEmail}
          isResending={isResending}
        />
      </div>
    );
  }

  const handleRegistrationSuccess = () => {
    setShowEmailConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 mb-6">Join our community today</p>
        </div>
        
        <CustomRegistrationForm onSuccess={handleRegistrationSuccess} />

        <div className="mt-4 p-4 bg-ceremonial-cream/50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-ceremonial-gold hover:text-ceremonial-gold/80"
              onClick={() => navigate("/auth/login")}
            >
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
