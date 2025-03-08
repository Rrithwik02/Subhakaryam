
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { SessionContextProvider, useSessionContext } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ServiceProviderRegister from "./pages/auth/ServiceProviderRegister";
import Search from "./pages/search/Search";
import AdminDashboard from "./components/admin/AdminDashboard";
import ServiceDashboard from "./components/service-provider/ServiceDashboard";
import { Toaster } from "./components/ui/toaster";
import { supabase } from "./integrations/supabase/client";
import BackButton from "./components/layout/BackButton";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Navbar from "./components/layout/Navbar";
import UserProfile from "./pages/profile/UserProfile";
import ServiceProviderProfile from "./pages/profile/ServiceProviderProfile";
import { useToast } from "./hooks/use-toast";
import ServicesPage from "./pages/services";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import TermsConditions from "./pages/policies/TermsConditions";
import CancellationPolicy from "./pages/policies/CancellationPolicy";
import RefundPolicy from "./pages/policies/RefundPolicy";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AuthStateHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useSessionContext();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
        navigate('/login');
        toast({
          title: "Signed out",
          description: "You have been signed out of your account.",
        });
      } else if (event === 'SIGNED_IN') {
        try {
          // Check user type for proper redirection
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", session?.user.id)
            .single();
          
          if (error) throw error;
          
          if (profile?.user_type === 'admin') {
            navigate("/admin");
            toast({
              title: "Admin Login Successful",
              description: "Welcome to your admin dashboard"
            });
          } else {
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
                title: "Provider Login Successful",
                description: "Welcome to your service provider dashboard"
              });
            } else {
              toast({
                title: "Signed in",
                description: "Welcome back!",
              });
              navigate("/");
            }
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
          toast({
            title: "Signed in",
            description: "Welcome back!",
          });
          navigate("/");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return null;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <Router>
          <AuthStateHandler />
          <Navbar />
          <BackButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/provider/profile" 
              element={
                <ProtectedRoute>
                  <ServiceProviderProfile />
                </ProtectedRoute>
              } 
            />
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
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <ServiceDashboard />
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
