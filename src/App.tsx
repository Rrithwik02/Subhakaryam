
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthCallback from "./pages/auth/AuthCallback";
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
import ServicesPage from "./pages/services";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import TermsConditions from "./pages/policies/TermsConditions";
import ShippingDelivery from "./pages/policies/ShippingDelivery";
import ServiceRequest from "./pages/ServiceRequest";
import TrackBooking from "./pages/TrackBooking";
import AddService from "./pages/auth/AddService";
import PoojaServices from "./pages/services/PoojaServices";
import WeddingPhotography from "./pages/services/WeddingPhotography";
import MehendiArtists from "./pages/services/MehendiArtists";
import CateringServices from "./pages/services/CateringServices";
import MusicServices from "./pages/services/MusicServices";
import DecorationServices from "./pages/services/DecorationServices";
import FunctionHallServices from "./pages/services/FunctionHallServices";
import BlogIndex from "./pages/blog/BlogIndex";
import BlogPost from "./pages/blog/BlogPost";
import TimelessWeddingTraditions from "./pages/blog/TimelessWeddingTraditions";
import EssentialHomeCeremonies from "./pages/blog/EssentialHomeCeremonies";
import FestivalCelebrations from "./pages/blog/FestivalCelebrations";
import BeautyStyleGuide from "./pages/blog/BeautyStyleGuide";
import PhotographyTips from "./pages/blog/PhotographyTips";
import CateringIdeas from "./pages/blog/CateringIdeas";
import DecorationTrends from "./pages/blog/DecorationTrends";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/error/ErrorBoundary";
import ProviderDetail from "./pages/provider/ProviderDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error?.message?.includes('auth') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <SessionContextProvider supabaseClient={supabase}>
            <AppContent />
          </SessionContextProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

const AppContent: React.FC = () => {

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <BackButton />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/track-booking" element={<TrackBooking />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/pooja-services" element={<PoojaServices />} />
            <Route path="/services/wedding-photography" element={<WeddingPhotography />} />
            <Route path="/services/mehendi-artists" element={<MehendiArtists />} />
            <Route path="/services/catering" element={<CateringServices />} />
            <Route path="/services/music" element={<MusicServices />} />
            <Route path="/services/decoration" element={<DecorationServices />} />
            <Route path="/services/function-hall" element={<FunctionHallServices />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blog/timeless-wedding-traditions" element={<TimelessWeddingTraditions />} />
        <Route path="/blog/essential-home-ceremonies" element={<EssentialHomeCeremonies />} />
        <Route path="/blog/festival-celebrations" element={<FestivalCelebrations />} />
        <Route path="/blog/beauty-style-guide" element={<BeautyStyleGuide />} />
        <Route path="/blog/photography-tips" element={<PhotographyTips />} />
        <Route path="/blog/catering-ideas" element={<CateringIdeas />} />
        <Route path="/blog/decoration-trends" element={<DecorationTrends />} />
            <Route path="/policies/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/policies/terms-conditions" element={<TermsConditions />} />
            <Route path="/policies/shipping-delivery" element={<ShippingDelivery />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
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
              path="/provider/:id" 
              element={
                <ProtectedRoute>
                  <ProviderDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/service-request" 
              element={
                <ProtectedRoute>
                  <ServiceRequest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/service/add" 
              element={
                <ProtectedRoute>
                  <AddService />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
      </div>
      <Toaster />
    </Router>
  );
};

export default App;
