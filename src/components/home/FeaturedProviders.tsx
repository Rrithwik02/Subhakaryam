import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const FeaturedProviders = () => {
  const navigate = useNavigate();

  const { data: providers, isLoading } = useQuery({
    queryKey: ['featured-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select('id,business_name,service_type,city,rating,base_price,profile_image')
        .eq('status', 'approved')
        .eq('is_premium', true)
        .order('rating', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
              Featured Service Providers
            </h2>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (!providers || providers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
            Featured Service Providers
          </h2>
          <p className="text-lg text-ceremonial-brown max-w-2xl mx-auto">
            Discover our top-rated and most trusted service providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {providers.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => navigate(`/provider/${provider.id}`)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-ceremonial-maroon text-lg mb-1">
                      {provider.business_name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {provider.service_type}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-ceremonial-gold/10 text-ceremonial-gold border-ceremonial-gold">
                        Premium
                      </Badge>
                    </div>
                  </div>
                  {provider.profile_image && (
                    <div className="w-12 h-12 rounded-full overflow-hidden ml-3">
                      <img 
                        src={provider.profile_image} 
                        alt={provider.business_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-ceremonial-gold fill-current" />
                    <span className="text-sm font-medium">{provider.rating || 4.5}</span>
                  </div>
                  <div className="flex items-center gap-1 text-ceremonial-brown">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{provider.city}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-ceremonial-gold font-semibold">
                    From ₹{provider.base_price?.toLocaleString()}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-ceremonial-maroon hover:text-ceremonial-gold"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/provider/${provider.id}`);
                    }}
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/search')}
            className="bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white px-8 py-3"
          >
            View All Providers
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProviders;