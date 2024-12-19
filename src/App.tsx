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

// Create a client
const queryClient = new QueryClient();

// Protected Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext();

  const checkIsAdmin = async () => {
    if (!session?.user) return false;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', session.user.id)
      .single();
    
    if (error || !data) return false;
    return data.user_type === 'admin';
  };

  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    checkIsAdmin().then(setIsAdmin);
  }, [session]);

  if (isLoading) return null;

  if (!session || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/service-provider" element={<ServiceProviderRegister />} />
            <Route path="/search" element={<Search />} />
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
}

export default App;