import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Truck, Clock, MapPin, Shield, Package, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ShippingDelivery = () => {
  return (
    <>
      <Helmet>
        <title>Shipping & Delivery Policy | Subhakary</title>
        <meta name="description" content="Learn about our shipping and delivery policies for service-related materials and booking confirmations. Fast, reliable delivery across India." />
        <meta name="keywords" content="shipping policy, delivery, service materials, booking confirmation, subhakary" />
        <link rel="canonical" href="https://subhakary.com/policies/shipping-delivery" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-ceremonial-cream to-white">
        {/* Header */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <Truck className="h-16 w-16 text-ceremonial-gold" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-ceremonial-maroon mb-4">
                Shipping & Delivery Policy
              </h1>
              <p className="text-xl text-ceremonial-brown max-w-3xl mx-auto">
                Information about delivery of service-related materials and booking confirmations
              </p>
            </div>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl space-y-8">
            
            {/* Service Nature */}
            <Card>
              <CardHeader>
                <CardTitle className="text-ceremonial-maroon flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Nature of Our Services
                </CardTitle>
              </CardHeader>
              <CardContent className="text-ceremonial-brown space-y-4">
                <p>
                  Subhakary primarily provides <strong>service-based offerings</strong> rather than physical products. 
                  Our main services include connecting customers with verified service providers for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pooja and religious ceremony services</li>
                  <li>Wedding photography and videography</li>
                  <li>Mehendi art services</li>
                  <li>Event decoration and catering</li>
                  <li>Music and DJ services</li>
                  <li>Function hall bookings</li>
                </ul>
                <p>
                  Since these are location-based services performed at your venue, traditional shipping doesn't apply. 
                  However, some services may include delivery of ceremony materials or equipment.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-ceremonial-maroon flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Delivery Support & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="text-ceremonial-brown space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-ceremonial-maroon mb-3">Track Your Service</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Real-time booking status updates</li>
                      <li>Service provider location tracking</li>
                      <li>Material delivery notifications</li>
                      <li>Customer support helpline</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ceremonial-maroon mb-3">Customer Support</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Phone:</strong> +91-XXXX-XXXX-XX</p>
                      <p><strong>Email:</strong> admin@subhakary.com</p>
                      <p><strong>Hours:</strong> 24/7 for urgent bookings</p>
                      <p><strong>WhatsApp:</strong> Available for quick queries</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </section>
      </div>
    </>
  );
};

export default ShippingDelivery;