
import { Navigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useSessionContext();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdminStatus, setCheckingAdminStatus] = useState(true);

  useEffect(() => {
    const checkIsAdmin = async () => {
      if (!session?.user) {
        console.log("No session, user is not admin");
        setIsAdmin(false);
        setCheckingAdminStatus(false);
        return;
      }
      
      try {
        // Simple direct query without using functions that might cause recursion
        console.log("Checking admin status for user:", session.user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error checking admin status:', error);
          throw error;
        }
        
        const isUserAdmin = data?.user_type === 'admin';
        console.log("Admin check result:", isUserAdmin, data);
        
        setIsAdmin(isUserAdmin);
        
        if (!isUserAdmin) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have admin privileges.",
          });
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdminStatus(false);
      }
    };

    if (!isLoading) {
      checkIsAdmin();
    }
  }, [session, isLoading, toast]);

  if (isLoading || checkingAdminStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    console.log("Access denied to admin route. Session:", !!session, "Is admin:", isAdmin);
    return <Navigate to="/login" replace />;
  }

  console.log("Access granted to admin route");
  return <>{children}</>;
};

export default AdminRoute;
