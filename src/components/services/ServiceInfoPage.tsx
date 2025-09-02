import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Star, Clock, Shield, Award, Heart, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ServiceSchema from '@/components/seo/ServiceSchema';
import { Link } from 'react-router-dom';

interface ServicePackage {
  name: string;
  price: string;
  duration?: string;
  time?: string;
  includes?: string;
  description?: string;
}

interface ServiceInfoPageProps {
  serviceName: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  searchParam: string;
  packages: ServicePackage[];
  badges: Array<{
    icon: React.ReactNode;
    text: string;
  }>;
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  cities: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  additionalSections?: React.ReactNode;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  priceRange: string;
}

const ServiceInfoPage: React.FC<ServiceInfoPageProps> = ({
  serviceName,
  title,
  description,
  icon,
  searchParam,
  packages,
  badges,
  features,
  cities,
  faqs,
  additionalSections,
  metaDescription,
  keywords,
  canonicalUrl,
  priceRange
}) => {
  return (
    <>
      <Helmet>
        <title>{title} | Subhakaryam</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <ServiceSchema 
        serviceName={serviceName}
        description={metaDescription}
        priceRange={priceRange}
      />

      <div className="min-h-screen bg-gradient-to-b from-ceremonial-cream to-white">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                {icon}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-ceremonial-maroon mb-4">
                {serviceName}
              </h1>
              <p className="text-xl text-ceremonial-brown max-w-3xl mx-auto mb-8">
                {description}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-4 py-2">
                    {badge.icon}
                    {badge.text}
                  </Badge>
                ))}
              </div>
              <Link to={`/search?service=${searchParam}`}>
                <Button size="lg" className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white px-8 py-3">
                  Find {serviceName}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services/Packages Grid */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Popular {serviceName} Packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-ceremonial-maroon">{pkg.name}</CardTitle>
                    <CardDescription>
                      {pkg.description || pkg.includes || "Professional service with all required materials"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-semibold text-ceremonial-gold">{pkg.price}</p>
                      {(pkg.duration || pkg.time) && (
                        <p className="text-sm text-ceremonial-brown flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {pkg.duration || pkg.time}
                        </p>
                      )}
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cities.map((city, index) => (
                <div key={index} className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <MapPin className="h-4 w-4 text-ceremonial-gold mr-2" />
                  <span className="font-medium text-ceremonial-maroon text-sm">{city}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Why Choose Our {serviceName}?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-ceremonial-maroon">{feature.title}</h3>
                  <p className="text-ceremonial-brown">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Sections */}
        {additionalSections}

        {/* FAQ Section */}
        {faqs && faqs.length > 0 && (
          <section className="py-16 px-4 bg-ceremonial-cream">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg text-ceremonial-maroon">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-ceremonial-brown">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ServiceInfoPage;