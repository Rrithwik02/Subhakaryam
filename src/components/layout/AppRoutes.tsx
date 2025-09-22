import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages for better performance
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const AuthCallback = lazy(() => import("@/pages/auth/AuthCallback"));
const ServiceProviderRegister = lazy(() => import("@/pages/auth/ServiceProviderRegister"));
const Search = lazy(() => import("@/pages/search/Search"));
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard"));
const ServiceDashboard = lazy(() => import("@/components/service-provider/ServiceDashboard"));
const AboutUs = lazy(() => import("@/pages/AboutUs"));
const ContactUs = lazy(() => import("@/pages/ContactUs"));
const UserProfile = lazy(() => import("@/pages/profile/UserProfile"));
const ServiceProviderProfile = lazy(() => import("@/pages/profile/ServiceProviderProfile"));
const ServicesPage = lazy(() => import("@/pages/services"));
const PrivacyPolicy = lazy(() => import("@/pages/policies/PrivacyPolicy"));
const TermsConditions = lazy(() => import("@/pages/policies/TermsConditions"));
const ShippingDelivery = lazy(() => import("@/pages/policies/ShippingDelivery"));
const ServiceRequest = lazy(() => import("@/pages/ServiceRequest"));
const TrackBooking = lazy(() => import("@/pages/TrackBooking"));
const AddService = lazy(() => import("@/pages/auth/AddService"));
const PoojaServices = lazy(() => import("@/pages/services/PoojaServices"));
const WeddingPhotography = lazy(() => import("@/pages/services/WeddingPhotography"));
const MehendiArtists = lazy(() => import("@/pages/services/MehendiArtists"));
const CateringServices = lazy(() => import("@/pages/services/CateringServices"));
const MusicServices = lazy(() => import("@/pages/services/MusicServices"));
const DecorationServices = lazy(() => import("@/pages/services/DecorationServices"));
const FunctionHallServices = lazy(() => import("@/pages/services/FunctionHallServices"));
const BlogIndex = lazy(() => import("@/pages/blog/BlogIndex"));
const BlogPost = lazy(() => import("@/pages/blog/BlogPost"));
const TimelessWeddingTraditions = lazy(() => import("@/pages/blog/TimelessWeddingTraditions"));
const EssentialHomeCeremonies = lazy(() => import("@/pages/blog/EssentialHomeCeremonies"));
const FestivalCelebrations = lazy(() => import("@/pages/blog/FestivalCelebrations"));
const BeautyStyleGuide = lazy(() => import("@/pages/blog/BeautyStyleGuide"));
const PhotographyTips = lazy(() => import("@/pages/blog/PhotographyTips"));
const CateringIdeas = lazy(() => import("@/pages/blog/CateringIdeas"));
const DecorationTrends = lazy(() => import("@/pages/blog/DecorationTrends"));
const ServiceBundles = lazy(() => import("@/pages/services/ServiceBundles"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ProviderDetail = lazy(() => import("@/pages/provider/ProviderDetail"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="max-w-md w-full space-y-4">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
        <Route path="/bundles" element={<ServiceBundles />} />
        
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
    </Suspense>
  );
};

export default AppRoutes;