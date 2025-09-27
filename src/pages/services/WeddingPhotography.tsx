import React, { useEffect } from 'react';
import { Camera, Award, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ServiceInfoPage from '@/components/services/ServiceInfoPage';

const WeddingPhotography = () => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/search?service=photo');
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect
  }

  const packages = [
    { name: "Pre-Wedding Shoot", price: "₹15,000 - ₹40,000", includes: "2-3 locations, 200+ edited photos" },
    { name: "Wedding Day Coverage", price: "₹50,000 - ₹1,50,000", includes: "Full day coverage, 500+ photos, highlights video" },
    { name: "Reception Photography", price: "₹25,000 - ₹75,000", includes: "Evening coverage, 300+ photos, candid shots" },
    { name: "Complete Wedding Package", price: "₹80,000 - ₹2,50,000", includes: "Pre-wedding + Wedding + Reception + Albums" },
    { name: "Destination Wedding", price: "₹1,00,000 - ₹5,00,000", includes: "Travel included, multi-day coverage" },
    { name: "Traditional Ceremonies", price: "₹20,000 - ₹60,000", includes: "Mehendi, Sangeet, Haldi coverage" }
  ];

  const badges = [
    { icon: <Award className="h-4 w-4 mr-2" />, text: "Award Winning Photographers" },
    { icon: <Star className="h-4 w-4 mr-2" />, text: "4.9+ Rating" },
    { icon: <Heart className="h-4 w-4 mr-2" />, text: "1000+ Happy Couples" }
  ];

  const features = [
    {
      icon: <Camera className="h-12 w-12 text-ceremonial-gold" />,
      title: "Professional Equipment",
      description: "Latest DSLR cameras, professional lighting, and drone coverage for aerial shots."
    },
    {
      icon: <Award className="h-12 w-12 text-ceremonial-gold" />,
      title: "Expert Editing",
      description: "Professional photo and video editing with color correction and enhancement."
    },
    {
      icon: <Heart className="h-12 w-12 text-ceremonial-gold" />,
      title: "Personalized Albums",
      description: "Custom-designed wedding albums and photo books with premium printing."
    }
  ];

  const cities = ["Visakhapatnam", "Vijayawada", "Hyderabad"];

  return (
    <ServiceInfoPage
      serviceName="Wedding Photography & Videography"
      title="Professional Wedding Photography & Videography Services"
      description="Capture your most precious moments with our professional wedding photographers and videographers. From intimate pre-wedding shoots to grand destination weddings, we create timeless memories that last forever."
      icon={<Camera className="h-16 w-16 text-ceremonial-gold" />}
      searchParam="photo"
      packages={packages}
      badges={badges}
      features={features}
      cities={cities}
      metaDescription="Capture your special moments with professional wedding photographers. Pre-wedding shoots, wedding day coverage, traditional ceremonies. Expert photographers across India."
      keywords="wedding photography, pre-wedding shoot, wedding videography, candid photography, traditional wedding photography, destination wedding photographer"
      canonicalUrl="https://subhakary.com/services/wedding-photography"
      priceRange="₹15,000-₹5,00,000"
    />
  );
};

export default WeddingPhotography;
