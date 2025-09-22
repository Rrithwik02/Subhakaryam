import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, Star, MapPin } from 'lucide-react';

const QuickStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['quick-stats'],
    queryFn: async () => {
      const [providersResult, bookingsResult, reviewsResult] = await Promise.all([
        supabase.from('service_providers').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('bookings').select('id', { count: 'exact' }),
        supabase.from('reviews').select('rating', { count: 'exact' }).eq('status', 'approved')
      ]);

      const providers = providersResult.count || 0;
      const bookings = bookingsResult.count || 0;
      const reviewCount = reviewsResult.count || 0;
      
      // Calculate average rating
      let avgRating = 4.8; // Default fallback
      if (reviewsResult.data && reviewsResult.data.length > 0) {
        const totalRating = reviewsResult.data.reduce((sum, review) => sum + (review.rating || 0), 0);
        avgRating = Number((totalRating / reviewsResult.data.length).toFixed(1));
      }

      return {
        providers,
        bookings,
        avgRating,
        reviewCount,
        cities: 15 // Static count for cities served
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const statItems = [
    {
      icon: <Users className="h-6 w-6 text-ceremonial-gold" />,
      value: stats?.providers || 150,
      label: "Verified Providers",
      suffix: "+"
    },
    {
      icon: <Calendar className="h-6 w-6 text-ceremonial-gold" />,
      value: stats?.bookings || 2500,
      label: "Ceremonies Completed",
      suffix: "+"
    },
    {
      icon: <Star className="h-6 w-6 text-ceremonial-gold" />,
      value: stats?.avgRating || 4.8,
      label: "Average Rating",
      suffix: "/5"
    },
    {
      icon: <MapPin className="h-6 w-6 text-ceremonial-gold" />,
      value: stats?.cities || 15,
      label: "Cities Served",
      suffix: "+"
    }
  ];

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-ceremonial-maroon to-ceremonial-brown">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => (
            <div key={index} className="text-center text-white">
              <div className="flex justify-center mb-2">
                {item.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">
                {item.value}{item.suffix}
              </div>
              <div className="text-sm md:text-base text-white/90">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickStats;