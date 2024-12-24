import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
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

// Create a client and configure it
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <Router>
          <Navbar />
          <BackButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
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