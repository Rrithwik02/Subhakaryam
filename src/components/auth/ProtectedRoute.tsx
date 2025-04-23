
import { Navigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useSessionContext();
  const { toast } = useToast();
  const [verifyingSession, setVerifyingSession] = useState(true);
  
  useEffect(() => {
    // Small timeout to ensure session is properly loaded
    const timer = setTimeout(() => {
      setVerifyingSession(false);
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to access this page",
        });
      }
    }, 500);
    
    console.log("ProtectedRoute: Checking session:", session?.user?.id);
    
    return () => clearTimeout(timer);
  }, [session, isLoading, toast]);

  if (isLoading || verifyingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  if (!session) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("Session verified, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
