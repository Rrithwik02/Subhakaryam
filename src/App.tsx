import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, useSessionContext } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ServiceProviderRegister from "./pages/auth/ServiceProviderRegister";
import Search from "./pages/search/Search";
import AdminDashboard from "./components/admin/AdminDashboard";
import { Toaster } from "./components/ui/toaster";
import { supabase } from "./integrations/supabase/client";
import { useToast } from "./hooks/use-toast";
import BackButton from "./components/layout/BackButton";

// Create a client
const queryClient = new QueryClient();

// Protected Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useSessionContext();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
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

  // Show loading state while checking admin status
  if (isLoading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  // Redirect non-admin users to login
  if (!session || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Add a new component for protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useSessionContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <Router>
          <BackButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/register/service-provider" 
              element={
                <ProtectedRoute>
                  <ServiceProviderRegister />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
          <Toaster />
        </Router>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;