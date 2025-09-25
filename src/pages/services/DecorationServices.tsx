import React, { useEffect } from 'react';
import { Palette, Award, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ServiceInfoPage from '@/components/services/ServiceInfoPage';

const DecorationServices = () => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/search?service=decoration');
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
    { name: "Mandap Decoration", price: "₹50,000 - ₹2,00,000", includes: "Traditional mandap with flowers, drapes, lighting & seating" },
    { name: "Stage Decoration", price: "₹30,000 - ₹1,50,000", includes: "Beautiful stage setup with backdrops, flowers & lighting" },
    { name: "Hall Decoration", price: "₹40,000 - ₹1,80,000", includes: "Complete venue decoration with themes, flowers & ambiance" },
    { name: "Entrance Decoration", price: "₹15,000 - ₹60,000", includes: "Grand entrance gates, rangoli, welcome arches" },
    { name: "Floral Decoration", price: "₹25,000 - ₹1,00,000", includes: "Fresh flower arrangements, garlands, bouquets" },
    { name: "Complete Wedding Package", price: "₹1,20,000 - ₹5,00,000", includes: "Full venue transformation with all decoration elements" }
  ];

  const badges = [
    { icon: <Award className="h-4 w-4 mr-2" />, text: "Creative Designers" },
    { icon: <Star className="h-4 w-4 mr-2" />, text: "4.8+ Rating" },
    { icon: <Heart className="h-4 w-4 mr-2" />, text: "1200+ Weddings" }
  ];

  const features = [
    {
      icon: <Palette className="h-12 w-12 text-ceremonial-gold" />,
      title: "Creative Designs",
      description: "Innovative decoration concepts that blend traditional elements with modern aesthetics."
    },
    {
      icon: <Award className="h-12 w-12 text-ceremonial-gold" />,
      title: "Premium Materials",
      description: "High-quality fabrics, fresh flowers, and durable decoration materials for lasting beauty."
    },
    {
      icon: <Heart className="h-12 w-12 text-ceremonial-gold" />,
      title: "Themed Decorations",
      description: "Customized themes and color schemes to match your wedding vision and preferences."
    }
  ];

  const cities = ["Visakhapatnam", "Vijayawada", "Hyderabad"];

  return (
    <ServiceInfoPage
      serviceName="Wedding Decoration Services"
      title="Professional Wedding Decoration Services"
      description="Transform your wedding venue into a magical paradise with our professional decoration services. From traditional mandap setups to modern themed decorations, we create stunning visual experiences for your special day."
      icon={<Palette className="h-16 w-16 text-ceremonial-gold" />}
      searchParam="decoration"
      packages={packages}
      badges={badges}
      features={features}
      cities={cities}
      metaDescription="Professional wedding decoration services including mandap, stage, hall, floral decorations. Creative designs and themes across India."
      keywords="wedding decoration, mandap decoration, stage decoration, floral decoration, wedding themes, venue decoration, marriage decoration"
      canonicalUrl="https://subhakaryam.org/services/decoration"
      priceRange="₹15,000-₹5,00,000"
    />
  );
};

export default DecorationServices;