import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Users, Calendar, Star, ArrowRight } from 'lucide-react';
import { PublicBundleCard } from '../bundles/PublicBundleCard';
import { useNavigate } from 'react-router-dom';

const FeaturedBundles = () => {
  const navigate = useNavigate();

  const { data: bundles, isLoading } = useQuery({
    queryKey: ['featured-bundles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_bundles')
        .select(`
          id,
          bundle_name,
          description,
          base_price,
          discounted_price,
          portfolio_images,
          service_providers!inner(id,business_name,city,rating,profile_image)
        `)
        .eq('is_active', true)
        .order('discount_percentage', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Service Bundles</h2>
            <p className="text-muted-foreground">Complete packages at unbeatable prices</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!bundles || bundles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Featured Service Bundles</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Save money with our carefully curated service packages. Complete solutions for your events at discounted prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {bundles.slice(0, 6).map((bundle) => (
            <PublicBundleCard
              key={bundle.id}
              bundle={bundle}
              provider={bundle.service_providers}
            />
          ))}
        </div>

        {bundles.length > 6 && (
          <div className="text-center">
            <Button onClick={() => navigate('/bundles')} className="gap-2">
              View All Bundles
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBundles;