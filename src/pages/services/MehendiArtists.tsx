import React, { useEffect } from 'react';
import { Brush, Star, Clock, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import ServiceInfoPage from '@/components/services/ServiceInfoPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MehendiArtists = () => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/search?service=mehendi');
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
    { name: "Bridal Mehendi", price: "₹5,000 - ₹25,000", time: "3-5 hours", description: "Intricate full hand and feet designs" },
    { name: "Simple Mehendi", price: "₹1,500 - ₹5,000", time: "1-2 hours", description: "Beautiful patterns for guests and family" },
    { name: "Arabic Mehendi", price: "₹2,500 - ₹8,000", time: "2-3 hours", description: "Bold and elegant Arabic patterns" },
    { name: "Indo-Arabic Fusion", price: "₹3,500 - ₹12,000", time: "2-4 hours", description: "Mix of traditional and Arabic styles" },
    { name: "Rajasthani Mehendi", price: "₹4,000 - ₹15,000", time: "3-4 hours", description: "Traditional Rajasthani intricate designs" },
    { name: "Modern Contemporary", price: "₹3,000 - ₹10,000", time: "2-3 hours", description: "Trendy and contemporary patterns" }
  ];

  const badges = [
    { icon: <Palette className="h-4 w-4 mr-2" />, text: "Natural Henna Only" },
    { icon: <Star className="h-4 w-4 mr-2" />, text: "Expert Artists" },
    { icon: <Clock className="h-4 w-4 mr-2" />, text: "Same Day Service" }
  ];

  const features = [
    {
      icon: <Palette className="h-12 w-12 text-ceremonial-gold" />,
      title: "Natural Henna",
      description: "We use only 100% natural henna paste made from fresh henna leaves, ensuring dark, long-lasting color without harmful chemicals."
    },
    {
      icon: <Star className="h-12 w-12 text-ceremonial-gold" />,
      title: "Expert Artists",
      description: "Our artists have years of experience and specialize in various traditional and contemporary mehendi styles from across India."
    },
    {
      icon: <Clock className="h-12 w-12 text-ceremonial-gold" />,
      title: "Timely Service",
      description: "Professional and punctual service with flexible timing options, including same-day bookings for urgent requirements."
    }
  ];

  const cities = ["Visakhapatnam", "Vijayawada", "Hyderabad"];

  // Mehendi Care Tips Section
  const careSection = (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
          Mehendi Care Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Before Application",
              tips: ["Clean hands with soap", "Avoid moisturizers", "Exfoliate gently", "Keep hands warm"]
            },
            {
              title: "After Application", 
              tips: ["Let dry for 2-3 hours", "Avoid water contact", "Apply lemon-sugar mixture", "Keep hands elevated"]
            },
            {
              title: "For Dark Color",
              tips: ["Apply eucalyptus oil", "Avoid washing for 12 hours", "Use natural heat", "Apply clove oil"]
            },
            {
              title: "Long-lasting Tips",
              tips: ["Avoid chlorinated water", "Use gloves for cleaning", "Apply coconut oil", "Avoid scrubbing"]
            }
          ].map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg text-ceremonial-maroon">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-ceremonial-brown flex items-center">
                      <span className="w-2 h-2 bg-ceremonial-gold rounded-full mr-3"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <ServiceInfoPage
      serviceName="Professional Mehendi Artists"
      title="Professional Mehendi Artists & Bridal Henna Services"
      description="Transform your hands into works of art with our skilled mehendi artists. From intricate bridal designs to elegant Arabic patterns, we create beautiful henna art using 100% natural and safe henna."
      icon={<Brush className="h-16 w-16 text-ceremonial-gold" />}
      searchParam="mehendi"
      packages={packages}
      badges={badges}
      features={features}
      cities={cities}
      additionalSections={careSection}
      metaDescription="Book expert mehendi artists for weddings and events. Bridal mehendi, Arabic designs, traditional patterns. Professional henna artists across India with natural henna."
      keywords="mehendi artists, bridal mehendi, henna designs, arabic mehendi, wedding mehendi, traditional henna, mehendi booking"
      canonicalUrl="https://subhakaryam.org/services/mehendi-artists"
      priceRange="₹1,500-₹25,000"
    />
  );
};

export default MehendiArtists;
