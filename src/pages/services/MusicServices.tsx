import React, { useEffect } from 'react';
import { Music, Award, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ServiceInfoPage from '@/components/services/ServiceInfoPage';

const MusicServices = () => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/search?service=music');
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
    { name: "Classical Music Performance", price: "₹25,000 - ₹75,000", includes: "Professional classical musicians with traditional instruments" },
    { name: "DJ & Sound System", price: "₹15,000 - ₹50,000", includes: "Professional DJ, sound system, lighting & music selection" },
    { name: "Live Band Performance", price: "₹40,000 - ₹1,20,000", includes: "Live band with vocals, complete sound setup" },
    { name: "Nadaswaram & Thavil", price: "₹20,000 - ₹60,000", includes: "Traditional South Indian wedding music ensemble" },
    { name: "Dhol & Shehnai", price: "₹18,000 - ₹55,000", includes: "Traditional North Indian wedding music with dhol players" },
    { name: "Complete Music Package", price: "₹60,000 - ₹2,00,000", includes: "Multi-day coverage with different music styles for each ceremony" }
  ];

  const badges = [
    { icon: <Award className="h-4 w-4 mr-2" />, text: "Professional Musicians" },
    { icon: <Star className="h-4 w-4 mr-2" />, text: "4.9+ Rating" },
    { icon: <Heart className="h-4 w-4 mr-2" />, text: "800+ Weddings" }
  ];

  const features = [
    {
      icon: <Music className="h-12 w-12 text-ceremonial-gold" />,
      title: "Traditional & Modern",
      description: "Expert musicians skilled in both classical traditions and contemporary music."
    },
    {
      icon: <Award className="h-12 w-12 text-ceremonial-gold" />,
      title: "Professional Equipment",
      description: "High-quality sound systems, microphones, and musical instruments for perfect audio."
    },
    {
      icon: <Heart className="h-12 w-12 text-ceremonial-gold" />,
      title: "Customized Playlists",
      description: "Personalized music selection based on your preferences and ceremony requirements."
    }
  ];

  const cities = ["Visakhapatnam", "Vijayawada", "Hyderabad"];

  return (
    <ServiceInfoPage
      serviceName="Wedding Music & Entertainment"
      title="Professional Wedding Music & Entertainment Services"
      description="Create the perfect ambiance for your wedding with our professional musicians and entertainers. From traditional nadaswaram to modern DJ services, we provide music that makes your celebration unforgettable."
      icon={<Music className="h-16 w-16 text-ceremonial-gold" />}
      searchParam="music"
      packages={packages}
      badges={badges}
      features={features}
      cities={cities}
      metaDescription="Professional wedding music services including classical musicians, DJ, live bands, nadaswaram, dhol. Traditional and modern music across India."
      keywords="wedding music, nadaswaram, dhol, wedding DJ, live band, classical music, traditional wedding music, sound system"
      canonicalUrl="https://subhakaryam.org/services/music"
      priceRange="₹15,000-₹2,00,000"
    />
  );
};

export default MusicServices;