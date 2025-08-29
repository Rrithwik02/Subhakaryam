import React from 'react';
import { Helmet } from 'react-helmet-async';
import { UserRoundCog, MapPin, Star, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ServiceSchema from '@/components/seo/ServiceSchema';
import { Link } from 'react-router-dom';

const PoojaServices = () => {
  const poojaTypes = [
    { name: "Griha Pravesh", price: "₹2,500 - ₹8,000", duration: "2-3 hours" },
    { name: "Satyanarayan Puja", price: "₹1,500 - ₹5,000", duration: "1-2 hours" },
    { name: "Ganesh Chaturthi", price: "₹3,000 - ₹10,000", duration: "3-4 hours" },
    { name: "Lakshmi Puja", price: "₹2,000 - ₹6,000", duration: "1-2 hours" },
    { name: "Rudrabhishek", price: "₹5,000 - ₹15,000", duration: "2-3 hours" },
    { name: "Vastu Shanti", price: "₹3,500 - ₹12,000", duration: "2-4 hours" }
  ];

  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];

  return (
    <>
      <Helmet>
        <title>Professional Pooja Services & Pandit Booking Online | Subhakaryam</title>
        <meta name="description" content="Book verified pandits for all Hindu ceremonies. Griha Pravesh, Satyanarayan Puja, Ganesh Chaturthi & more. Expert priests available across India with authentic rituals." />
        <meta name="keywords" content="pooja services, pandit booking, hindu ceremonies, griha pravesh, satyanarayan puja, ganesh chaturthi, online pandit booking" />
        <link rel="canonical" href="https://subhakaryam.org/services/pooja-services" />
      </Helmet>

      <ServiceSchema 
        serviceName="Pooja Services & Pandit Booking"
        description="Professional Hindu ceremony services with verified pandits for all traditional rituals including Griha Pravesh, Satyanarayan Puja, and festival celebrations."
        priceRange="₹1,500-₹15,000"
      />

      <div className="min-h-screen bg-gradient-to-b from-ceremonial-cream to-white">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <UserRoundCog className="h-16 w-16 text-ceremonial-gold" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-ceremonial-maroon mb-4">
                Professional Pooja Services
              </h1>
              <p className="text-xl text-ceremonial-brown max-w-3xl mx-auto mb-8">
                Book verified and experienced pandits for all Hindu ceremonies. From Griha Pravesh to festival celebrations, 
                our certified priests ensure authentic rituals with proper Vedic chanting and traditional procedures.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Verified Pandits
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Star className="h-4 w-4 mr-2" />
                  4.8+ Rating
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Same Day Booking
                </Badge>
              </div>
              <Link to="/search?service=poojari">
                <Button size="lg" className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white px-8 py-3">
                  Find Pooja Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Popular Pooja Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {poojaTypes.map((pooja, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-ceremonial-maroon">{pooja.name}</CardTitle>
                    <CardDescription>Traditional ceremony with all required materials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-semibold text-ceremonial-gold">{pooja.price}</p>
                      <p className="text-sm text-ceremonial-brown flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {pooja.duration}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cities Section */}
        <section className="py-16 px-4 bg-ceremonial-cream">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-8 text-ceremonial-maroon">
              Available in Major Cities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cities.map((city, index) => (
                <div key={index} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <MapPin className="h-5 w-5 text-ceremonial-gold mr-2" />
                  <span className="font-medium text-ceremonial-maroon">{city}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Why Choose Our Pooja Services?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className="h-12 w-12 text-ceremonial-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-ceremonial-maroon">Verified Pandits</h3>
                <p className="text-ceremonial-brown">All our priests are verified with proper credentials and years of experience in performing traditional ceremonies.</p>
              </div>
              <div className="text-center">
                <Star className="h-12 w-12 text-ceremonial-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-ceremonial-maroon">Authentic Rituals</h3>
                <p className="text-ceremonial-brown">Traditional Vedic procedures followed with proper Sanskrit chanting and complete ceremony materials included.</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-ceremonial-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-ceremonial-maroon">Flexible Timing</h3>
                <p className="text-ceremonial-brown">Book ceremonies at your preferred date and time with same-day booking available for urgent requirements.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-ceremonial-cream">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "What is included in the pooja service?",
                  a: "Our pooja services include a verified pandit, all required ceremony materials (flowers, fruits, incense, etc.), proper Vedic chanting, and guidance throughout the ceremony."
                },
                {
                  q: "How do I book a pandit for same-day service?",
                  a: "You can book same-day service by calling our helpline or using our instant booking feature. Subject to pandit availability in your area."
                },
                {
                  q: "Are the pandits background verified?",
                  a: "Yes, all our pandits undergo thorough background verification and have valid credentials from recognized institutions."
                },
                {
                  q: "What if I need to cancel or reschedule?",
                  a: "You can cancel or reschedule up to 24 hours before the ceremony. Our customer support team will help you with the process."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg text-ceremonial-maroon">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-ceremonial-brown">{faq.a}</p>
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

export default PoojaServices;