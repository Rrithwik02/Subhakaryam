import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Camera, MapPin, Star, Award, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ServiceSchema from '@/components/seo/ServiceSchema';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';

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

  const styles = ["Traditional", "Candid", "Cinematic", "Vintage", "Contemporary", "Documentary"];

  return (
    <>
      <Helmet>
        <title>Professional Wedding Photography & Videography Services | Subhakaryam</title>
        <meta name="description" content="Capture your special moments with professional wedding photographers. Pre-wedding shoots, wedding day coverage, traditional ceremonies. Expert photographers across India." />
        <meta name="keywords" content="wedding photography, pre-wedding shoot, wedding videography, candid photography, traditional wedding photography, destination wedding photographer" />
        <link rel="canonical" href="https://subhakaryam.org/services/wedding-photography" />
      </Helmet>

      <ServiceSchema 
        serviceName="Wedding Photography & Videography"
        description="Professional wedding photography services including pre-wedding shoots, wedding day coverage, and traditional ceremony documentation with experienced photographers."
        priceRange="₹15,000-₹5,00,000"
      />

      <div className="min-h-screen bg-gradient-to-b from-ceremonial-cream to-white">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <Camera className="h-16 w-16 text-ceremonial-gold" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-ceremonial-maroon mb-4">
                Wedding Photography & Videography
              </h1>
              <p className="text-xl text-ceremonial-brown max-w-3xl mx-auto mb-8">
                Capture your most precious moments with our professional wedding photographers and videographers. 
                From intimate pre-wedding shoots to grand destination weddings, we create timeless memories that last forever.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Award className="h-4 w-4 mr-2" />
                  Award Winning Photographers
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Star className="h-4 w-4 mr-2" />
                  4.9+ Rating
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Heart className="h-4 w-4 mr-2" />
                  1000+ Happy Couples
                </Badge>
              </div>
              <Link to="/search?service=photo">
                <Button size="lg" className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white px-8 py-3">
                  Book Photographer
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Photography Packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-ceremonial-maroon">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.includes}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-ceremonial-gold text-lg">{pkg.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Photography Styles */}
        <section className="py-16 px-4 bg-ceremonial-cream">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Photography Styles
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {styles.map((style, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-medium text-ceremonial-maroon">{style}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Features */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              What's Included in Our Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <Camera className="h-12 w-12 text-ceremonial-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-ceremonial-maroon">Professional Equipment</h3>
                <p className="text-ceremonial-brown text-sm">Latest DSLR cameras, professional lighting, and drone coverage for aerial shots.</p>
              </div>
              <div className="text-center">
                <Award className="h-12 w-12 text-ceremonial-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-ceremonial-maroon">Expert Editing</h3>
                <p className="text-ceremonial-brown text-sm">Professional photo and video editing with color correction and enhancement.</p>
              </div>
              <div className="text-center">
                <Heart className="h-12 w-12 text-ceremonial-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-ceremonial-maroon">Personalized Albums</h3>
                <p className="text-ceremonial-brown text-sm">Custom-designed wedding albums and photo books with premium printing.</p>
              </div>
              <div className="text-center">
                <Star className="h-12 w-12 text-ceremonial-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-ceremonial-maroon">Online Gallery</h3>
                <p className="text-ceremonial-brown text-sm">Private online gallery to share photos with family and friends.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Cities */}
        <section className="py-16 px-4 bg-ceremonial-cream">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-8 text-ceremonial-maroon">
              Serving Across India
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {["Mumbai", "Delhi", "Goa", "Udaipur", "Jaipur", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kerala"].map((city, index) => (
                <div key={index} className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <MapPin className="h-4 w-4 text-ceremonial-gold mr-2" />
                  <span className="font-medium text-ceremonial-maroon text-sm">{city}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default WeddingPhotography;