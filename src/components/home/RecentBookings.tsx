import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';

const RecentBookings = () => {
  const { data: recentBookings } = useQuery({
    queryKey: ['recent-bookings-display'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          service_date,
          status,
          service_providers!inner(
            business_name,
            service_type,
            city
          )
        `)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!recentBookings || recentBookings.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-ceremonial-cream">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
            Recent Bookings
          </h2>
          <p className="text-lg text-ceremonial-brown max-w-2xl mx-auto">
            See what ceremonies are happening in your area
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentBookings.map((booking) => (
            <Card key={booking.id} className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-ceremonial-maroon">
                    {booking.service_providers.business_name}
                  </CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Confirmed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-ceremonial-brown">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{booking.service_providers.service_type}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-ceremonial-brown">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {format(new Date(booking.service_date), 'PPP')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-ceremonial-brown">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{booking.service_providers.city}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentBookings;