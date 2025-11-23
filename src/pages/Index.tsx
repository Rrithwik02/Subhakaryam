
import React, { useEffect, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import SuggestionForm from "@/components/suggestions/SuggestionForm";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import HowItWorks from "@/components/home/HowItWorks";
import Footer from "@/components/layout/Footer";
import AdvertCarousel from "@/components/home/AdvertCarousel";
import Chatbot from "@/components/chat/Chatbot";
import FAQSchema from "@/components/seo/FAQSchema";
import MetaTags from "@/components/seo/MetaTags";
import ScrollToTop from "@/components/ui/scroll-to-top";
import TrustIndicators from "@/components/home/TrustIndicators";
import PWAInstall from "@/components/ui/pwa-install";
import { useToast } from "@/hooks/use-toast";
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import SectionErrorBoundary from "@/components/error/SectionErrorBoundary";

// Lazy load below-the-fold components
const FeaturedProviders = lazy(() => import("@/components/home/FeaturedProviders"));
const FeaturedBundles = lazy(() => import("@/components/home/FeaturedBundles"));
const EssentialsPreview = lazy(() => import("@/components/home/EssentialsPreview"));
const Testimonials = lazy(() => import("@/components/home/Testimonials"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading } = useSessionContext();
  
  const [isServiceProvider, setIsServiceProvider] = React.useState(false);

  useEffect(() => {
    // Defer non-critical user status check
    if (!session?.user) return;
    
    const checkUserStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('service_providers')
          .select('id')
          .eq('profile_id', session.user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') return;
        setIsServiceProvider(!!data);
      } catch {
        // Silently fail
      }
    };

    // Use requestIdleCallback for non-critical work
    if ('requestIdleCallback' in window) {
      requestIdleCallback(checkUserStatus);
    } else {
      setTimeout(checkUserStatus, 100);
    }
  }, [session]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" role="status" aria-label="Loading">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ceremonial-cream">
      <MetaTags
        title="Subhakary - Sacred Ceremonies & Traditional Indian Services | #1 Platform for Authentic Rituals"
        description="India's premier platform for booking trusted pandits, photographers, caterers & decorators. Authentic Indian weddings, pooja rituals, mehendi ceremonies & traditional events across India. Expert religious services available 24/7."
        keywords="subhakary, indian wedding services, pooja ceremonies, pandit booking, mehendi artists, traditional decorators, wedding photography, catering services, function halls, religious ceremonies india"
        canonical="https://subhakary.com/"
      />
      <FAQSchema />

      <Hero />
      <TrustIndicators />
      <Services />
      
      <AdvertCarousel />
      
      <SectionErrorBoundary sectionName="Featured Providers">
        <Suspense fallback={
          <div className="container mx-auto px-4 py-12">
            <EnhancedSkeleton className="h-8 w-64 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <EnhancedSkeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        }>
          <FeaturedProviders />
        </Suspense>
      </SectionErrorBoundary>
      
      <HowItWorks />
      
      <SectionErrorBoundary sectionName="Testimonials">
        <Suspense fallback={<EnhancedSkeleton className="h-96 w-full" />}>
          <Testimonials />
        </Suspense>
      </SectionErrorBoundary>
      
      <SectionErrorBoundary sectionName="Call to Action">
        <Suspense fallback={<EnhancedSkeleton className="h-64 w-full" />}>
          <CTASection />
        </Suspense>
      </SectionErrorBoundary>
      
      {session && !isServiceProvider && (
        <div className="max-w-md mx-auto px-4 py-12">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-full shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff] bg-ceremonial-gold hover:bg-ceremonial-gold/90"
              >
                Suggest a Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suggest a Service</DialogTitle>
              </DialogHeader>
              <SuggestionForm />
            </DialogContent>
          </Dialog>
        </div>
      )}
      
      <Chatbot />
      <ScrollToTop />
      <PWAInstall />
      <Footer />
    </div>
  );
};

export default Index;
