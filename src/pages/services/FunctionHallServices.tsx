import React, { useEffect } from 'react';
import { Building, Award, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ServiceInfoPage from '@/components/services/ServiceInfoPage';

const FunctionHallServices = () => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/search?service=function-hall');
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
    { name: "Small Function Hall", price: "₹20,000 - ₹60,000", includes: "200-300 guests capacity with basic amenities & parking" },
    { name: "Medium Function Hall", price: "₹40,000 - ₹1,20,000", includes: "500-800 guests capacity with AC, sound system & catering space" },
    { name: "Large Banquet Hall", price: "₹80,000 - ₹2,50,000", includes: "1000+ guests capacity with premium amenities & decoration" },
    { name: "Outdoor Wedding Venue", price: "₹60,000 - ₹2,00,000", includes: "Garden/lawn setup with weather backup & event management" },
    { name: "Luxury Wedding Resort", price: "₹1,50,000 - ₹5,00,000", includes: "Premium resort with accommodation, dining & complete services" },
    { name: "Community Hall", price: "₹15,000 - ₹50,000", includes: "Traditional community spaces with basic facilities" }
  ];

  const badges = [
    { icon: <Award className="h-4 w-4 mr-2" />, text: "Premium Venues" },
    { icon: <Star className="h-4 w-4 mr-2" />, text: "4.7+ Rating" },
    { icon: <Heart className="h-4 w-4 mr-2" />, text: "500+ Events Hosted" }
  ];

  const features = [
    {
      icon: <Building className="h-12 w-12 text-ceremonial-gold" />,
      title: "Modern Facilities",
      description: "Well-equipped venues with AC, sound systems, lighting, and ample parking space."
    },
    {
      icon: <Award className="h-12 w-12 text-ceremonial-gold" />,
      title: "Flexible Capacity",
      description: "Venues ranging from intimate gatherings to grand celebrations with various seating arrangements."
    },
    {
      icon: <Heart className="h-12 w-12 text-ceremonial-gold" />,
      title: "Complete Support",
      description: "Professional event management support including setup, maintenance, and coordination."
    }
  ];

  const cities = ["Visakhapatnam", "Vijayawada", "Hyderabad"];

  return (
    <ServiceInfoPage
      serviceName="Function Hall & Venue Services"
      title="Premium Function Hall & Wedding Venue Services"
      description="Find the perfect venue for your wedding celebration with our extensive collection of function halls, banquet halls, and wedding venues. From intimate spaces to grand ballrooms, we have the ideal setting for your special day."
      icon={<Building className="h-16 w-16 text-ceremonial-gold" />}
      searchParam="function-hall"
      packages={packages}
      badges={badges}
      features={features}
      cities={cities}
      metaDescription="Premium function halls and wedding venues with modern facilities. Small to large capacity venues, banquet halls, outdoor venues across India."
      keywords="function hall, wedding venue, banquet hall, marriage hall, event venue, wedding resort, community hall, reception venue"
      canonicalUrl="https://subhakaryam.org/services/function-hall"
      priceRange="₹15,000-₹5,00,000"
    />
  );
};

export default FunctionHallServices;