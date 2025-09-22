import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PublicBundleCard } from '@/components/bundles/PublicBundleCard';
import { BundleBookingDialog } from '@/components/bundles/BundleBookingDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, Filter, Users, Calendar, MapPin } from 'lucide-react';
import MetaTags from '@/components/seo/MetaTags';

const ServiceBundles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const { data: bundles, isLoading } = useQuery({
    queryKey: ['service-bundles', searchQuery, selectedCity, selectedServiceType, priceRange],
    queryFn: async () => {
      let query = supabase
        .from('service_bundles')
        .select(`
          *,
          bundle_items (*),
          service_providers (
            id,
            business_name,
            city,
            rating,
            service_type,
            profile_image
          )
        `)
        .eq('is_active', true);

      if (searchQuery) {
        query = query.or(`bundle_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (selectedCity) {
        query = query.eq('service_providers.city', selectedCity);
      }

      if (selectedServiceType) {
        query = query.eq('service_providers.service_type', selectedServiceType);
      }

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('discounted_price', min).lte('discounted_price', max);
        } else {
          query = query.gte('discounted_price', min);
        }
      }

      const { data, error } = await query.order('discount_percentage', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: cities } = useQuery({
    queryKey: ['bundle-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select('city')
        .not('city', 'is', null);

      if (error) throw error;
      return [...new Set(data.map(p => p.city))].sort();
    },
  });

  const { data: serviceTypes } = useQuery({
    queryKey: ['bundle-service-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select('service_type')
        .not('service_type', 'is', null);

      if (error) throw error;
      return [...new Set(data.map(p => p.service_type))].sort();
    },
  });

  const handleBookBundle = (bundle: any, provider: any) => {
    setSelectedBundle(bundle);
    setSelectedProvider(provider);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedServiceType('');
    setPriceRange('');
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Service Bundles - Complete Event Packages | Your Site"
        description="Discover complete service bundles for your events. Save money with our curated packages including photography, catering, decoration and more."
        keywords="service bundles, event packages, wedding packages, photography bundles, catering packages"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold">Service Bundles</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete event solutions at discounted prices. Choose from our carefully crafted bundles 
              or work with providers to create custom packages.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bundles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities?.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes?.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-25000">Under ₹25,000</SelectItem>
                    <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                    <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                    <SelectItem value="100000-200000">₹1,00,000 - ₹2,00,000</SelectItem>
                    <SelectItem value="200000">Above ₹2,00,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {bundles ? `${bundles.length} bundles found` : 'Loading...'}
                </div>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bundles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : bundles && bundles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map((bundle) => (
                <div key={bundle.id} onClick={() => handleBookBundle(bundle, bundle.service_providers)}>
                  <PublicBundleCard
                    bundle={bundle}
                    provider={bundle.service_providers}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bundles found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={resetFilters}>Clear All Filters</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Service Bundles?</h2>
            <p className="text-muted-foreground">Get more value with our comprehensive packages</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Save Money</h3>
                <p className="text-sm text-muted-foreground">
                  Get multiple services at discounted bundle prices
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Coordinated Service</h3>
                <p className="text-sm text-muted-foreground">
                  All services work together seamlessly for your event
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Simplified Planning</h3>
                <p className="text-sm text-muted-foreground">
                  One booking covers all your event needs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      {selectedBundle && selectedProvider && (
        <BundleBookingDialog
          bundle={selectedBundle}
          provider={selectedProvider}
          open={!!selectedBundle}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedBundle(null);
              setSelectedProvider(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default ServiceBundles;