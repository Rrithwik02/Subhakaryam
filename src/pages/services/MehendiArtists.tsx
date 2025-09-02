import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Brush, MapPin, Star, Clock, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ServiceSchema from '@/components/seo/ServiceSchema';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';

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

  const styles = ["Traditional", "Arabic", "Rajasthani", "Gujarati", "Pakistani", "Indo-Arabic", "Contemporary", "Minimal"];

  return (
    <>
      <Helmet>
        <title>Professional Mehendi Artists & Bridal Henna Services | Subhakaryam</title>
        <meta name="description" content="Book expert mehendi artists for weddings and events. Bridal mehendi, Arabic designs, traditional patterns. Professional henna artists across India with natural henna." />
        <meta name="keywords" content="mehendi artists, bridal mehendi, henna designs, arabic mehendi, wedding mehendi, traditional henna, mehendi booking" />
        <link rel="canonical" href="https://subhakaryam.org/services/mehendi-artists" />
      </Helmet>

      <ServiceSchema 
        serviceName="Mehendi Artists & Henna Services"
        description="Professional mehendi artists specializing in bridal henna, Arabic designs, and traditional patterns for weddings and special occasions with natural henna."
        priceRange="₹1,500-₹25,000"
      />

      <div className="min-h-screen bg-gradient-to-b from-ceremonial-cream to-white">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <Brush className="h-16 w-16 text-ceremonial-gold" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-ceremonial-maroon mb-4">
                Professional Mehendi Artists
              </h1>
              <p className="text-xl text-ceremonial-brown max-w-3xl mx-auto mb-8">
                Transform your hands into works of art with our skilled mehendi artists. From intricate bridal designs to 
                elegant Arabic patterns, we create beautiful henna art using 100% natural and safe henna.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Palette className="h-4 w-4 mr-2" />
                  Natural Henna Only
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Star className="h-4 w-4 mr-2" />
                  Expert Artists
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Same Day Service
                </Badge>
              </div>
              <Link to="/search?service=mehendi">
                <Button size="lg" className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white px-8 py-3">
                  Book Mehendi Artist
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Mehendi Design Packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-ceremonial-maroon">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-semibold text-ceremonial-gold">{pkg.price}</p>
                      <p className="text-sm text-ceremonial-brown flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {pkg.time}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Design Styles */}
        <section className="py-16 px-4 bg-ceremonial-cream">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Popular Design Styles
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {styles.map((style, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Brush className="h-8 w-8 text-ceremonial-gold mx-auto mb-2" />
                  <span className="font-medium text-ceremonial-maroon">{style}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our Artists */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Why Choose Our Mehendi Artists?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Palette className="h-12 w-12 text-ceremonial-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-ceremonial-maroon">Natural Henna</h3>
                <p className="text-ceremonial-brown">We use only 100% natural henna paste made from fresh henna leaves, ensuring dark, long-lasting color without harmful chemicals.</p>
              </div>
              <div className="text-center">
                <Star className="h-12 w-12 text-ceremonial-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-ceremonial-maroon">Expert Artists</h3>
                <p className="text-ceremonial-brown">Our artists have years of experience and specialize in various traditional and contemporary mehendi styles from across India.</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-ceremonial-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-ceremonial-maroon">Timely Service</h3>
                <p className="text-ceremonial-brown">Professional and punctual service with flexible timing options, including same-day bookings for urgent requirements.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Available Cities */}
        <section className="py-16 px-4 bg-ceremonial-cream">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-8 text-ceremonial-maroon">
              Available Across India
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {["Mumbai", "Delhi", "Jaipur", "Udaipur", "Bangalore", "Hyderabad", "Chennai", "Pune", "Ahmedabad", "Kolkata"].map((city, index) => (
                <div key={index} className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <MapPin className="h-4 w-4 text-ceremonial-gold mr-2" />
                  <span className="font-medium text-ceremonial-maroon text-sm">{city}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Care Instructions */}
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
      </div>
    </>
  );
};

export default MehendiArtists;