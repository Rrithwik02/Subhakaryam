import { Navigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useSessionContext();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsAdmin = async () => {
      if (!session?.user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        const isUserAdmin = data?.user_type === 'admin';
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
      }
    };

    if (!isLoading) {
      checkIsAdmin();
    }
  }, [session, isLoading, toast]);

  if (isLoading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;