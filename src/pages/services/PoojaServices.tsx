import React, { useEffect } from 'react';
import { UserRoundCog, Shield, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ServiceInfoPage from '@/components/services/ServiceInfoPage';

const PoojaServices = () => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/search?service=poojari');
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

  const poojaTypes = [
    { name: "Griha Pravesh", price: "₹2,500 - ₹8,000", duration: "2-3 hours", description: "Traditional housewarming ceremony with all required materials" },
    { name: "Satyanarayan Puja", price: "₹1,500 - ₹5,000", duration: "1-2 hours", description: "Sacred puja for prosperity and blessings" },
    { name: "Ganesh Chaturthi", price: "₹3,000 - ₹10,000", duration: "3-4 hours", description: "Complete Ganesh festival celebration" },
    { name: "Lakshmi Puja", price: "₹2,000 - ₹6,000", duration: "1-2 hours", description: "Wealth and prosperity ceremony" },
    { name: "Rudrabhishek", price: "₹5,000 - ₹15,000", duration: "2-3 hours", description: "Sacred Shiva worship ritual" },
    { name: "Vastu Shanti", price: "₹3,500 - ₹12,000", duration: "2-4 hours", description: "Home blessing and purification ceremony" }
  ];

  const badges = [
    { icon: <Shield className="h-4 w-4 mr-2" />, text: "Verified Pandits" },
    { icon: <Star className="h-4 w-4 mr-2" />, text: "4.8+ Rating" },
    { icon: <Clock className="h-4 w-4 mr-2" />, text: "Same Day Booking" }
  ];

  const features = [
    {
      icon: <Shield className="h-12 w-12 text-ceremonial-gold" />,
      title: "Verified Pandits",
      description: "All our priests are verified with proper credentials and years of experience in performing traditional ceremonies."
    },
    {
      icon: <Star className="h-12 w-12 text-ceremonial-gold" />,
      title: "Authentic Rituals",
      description: "Traditional Vedic procedures followed with proper Sanskrit chanting and complete ceremony materials included."
    },
    {
      icon: <Clock className="h-12 w-12 text-ceremonial-gold" />,
      title: "Flexible Timing",
      description: "Book ceremonies at your preferred date and time with same-day booking available for urgent requirements."
    }
  ];

  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];

  const faqs = [
    {
      question: "What is included in the pooja service?",
      answer: "Our pooja services include a verified pandit, all required ceremony materials (flowers, fruits, incense, etc.), proper Vedic chanting, and guidance throughout the ceremony."
    },
    {
      question: "How do I book a pandit for same-day service?",
      answer: "You can book same-day service by calling our helpline or using our instant booking feature. Subject to pandit availability in your area."
    },
    {
      question: "Are the pandits background verified?",
      answer: "Yes, all our pandits undergo thorough background verification and have valid credentials from recognized institutions."
    },
    {
      question: "What if I need to cancel or reschedule?",
      answer: "You can cancel or reschedule up to 24 hours before the ceremony. Our customer support team will help you with the process."
    }
  ];

  return (
    <ServiceInfoPage
      serviceName="Professional Pooja Services"
      title="Professional Pooja Services & Pandit Booking Online"
      description="Book verified and experienced pandits for all Hindu ceremonies. From Griha Pravesh to festival celebrations, our certified priests ensure authentic rituals with proper Vedic chanting and traditional procedures."
      icon={<UserRoundCog className="h-16 w-16 text-ceremonial-gold" />}
      searchParam="poojari"
      packages={poojaTypes}
      badges={badges}
      features={features}
      cities={cities}
      faqs={faqs}
      metaDescription="Book verified pandits for all Hindu ceremonies. Griha Pravesh, Satyanarayan Puja, Ganesh Chaturthi & more. Expert priests available across India with authentic rituals."
      keywords="pooja services, pandit booking, hindu ceremonies, griha pravesh, satyanarayan puja, ganesh chaturthi, online pandit booking"
      canonicalUrl="https://subhakaryam.org/services/pooja-services"
      priceRange="₹1,500-₹15,000"
    />
  );
};

export default PoojaServices;
