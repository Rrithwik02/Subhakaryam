import React, { useEffect } from 'react';
import { ChefHat, Award, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ServiceInfoPage from '@/components/services/ServiceInfoPage';

const CateringServices = () => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/search?service=catering');
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
    { name: "Vegetarian Wedding Catering", price: "₹300 - ₹800 per person", includes: "Full course meal with 8-12 dishes, desserts & beverages" },
    { name: "South Indian Traditional", price: "₹250 - ₹600 per person", includes: "Authentic South Indian meals with banana leaf service" },
    { name: "North Indian Feast", price: "₹350 - ₹900 per person", includes: "Rich gravies, breads, rice varieties & sweets" },
    { name: "Live Counter Catering", price: "₹400 - ₹1000 per person", includes: "Chaat, dosa, pasta & other live cooking stations" },
    { name: "Buffet Style Service", price: "₹280 - ₹700 per person", includes: "Self-service buffet with multiple cuisine options" },
    { name: "Premium Wedding Package", price: "₹500 - ₹1500 per person", includes: "Multi-cuisine feast with premium ingredients & service" }
  ];

  const badges = [
    { icon: <Award className="h-4 w-4 mr-2" />, text: "Experienced Chefs" },
    { icon: <Star className="h-4 w-4 mr-2" />, text: "4.8+ Rating" },
    { icon: <Heart className="h-4 w-4 mr-2" />, text: "1500+ Events Catered" }
  ];

  const features = [
    {
      icon: <ChefHat className="h-12 w-12 text-ceremonial-gold" />,
      title: "Expert Chefs",
      description: "Professional chefs with years of experience in traditional and modern cuisines."
    },
    {
      icon: <Award className="h-12 w-12 text-ceremonial-gold" />,
      title: "Quality Ingredients",
      description: "Fresh, high-quality ingredients sourced from trusted vendors for authentic taste."
    },
    {
      icon: <Heart className="h-12 w-12 text-ceremonial-gold" />,
      title: "Customized Menus",
      description: "Personalized menu planning based on your preferences and dietary requirements."
    }
  ];

  const cities = ["Visakhapatnam", "Vijayawada", "Hyderabad", "Chennai", "Bangalore", "Mumbai", "Delhi", "Pune", "Ahmedabad"];

  return (
    <ServiceInfoPage
      serviceName="Wedding Catering Services"
      title="Professional Wedding Catering Services"
      description="Delight your guests with authentic Indian cuisine and professional catering services. From traditional South Indian meals to elaborate North Indian feasts, we create memorable dining experiences for your special day."
      icon={<ChefHat className="h-16 w-16 text-ceremonial-gold" />}
      searchParam="catering"
      packages={packages}
      badges={badges}
      features={features}
      cities={cities}
      metaDescription="Professional wedding catering services with authentic Indian cuisine. Traditional South Indian, North Indian feasts, live counters. Expert chefs across India."
      keywords="wedding catering, South Indian catering, North Indian food, live counter catering, traditional wedding food, buffet catering"
      canonicalUrl="https://subhakaryam.org/services/catering"
      priceRange="₹250-₹1500 per person"
    />
  );
};

export default CateringServices;