
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Index from "@/pages/Index";
import AboutUs from "@/pages/AboutUs";
import ContactUs from "@/pages/ContactUs";
import Services from "@/pages/services";
import Search from "@/pages/search/Search";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ServiceProviderRegister from "@/pages/auth/ServiceProviderRegister";
import UserProfile from "@/pages/profile/UserProfile";
import ServiceProviderProfile from "@/pages/profile/ServiceProviderProfile";
import TermsConditions from "@/pages/policies/TermsConditions";
import PrivacyPolicy from "@/pages/policies/PrivacyPolicy";
import RefundPolicy from "@/pages/policies/RefundPolicy";
import CancellationPolicy from "@/pages/policies/CancellationPolicy";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";
import AdminDashboard from "@/components/admin/AdminDashboard";
import ServiceDashboard from "@/components/service-provider/ServiceDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/service-provider" element={<ServiceProviderRegister />} />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/provider/profile" element={
                <ProtectedRoute>
                  <ServiceProviderProfile />
                </ProtectedRoute>
              } />
              
              {/* Admin Dashboard Route */}
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              {/* Service Provider Dashboard Route */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <ServiceDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
