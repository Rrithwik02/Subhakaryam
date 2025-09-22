import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Star, Filter, DollarSign, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import PaymentScheduleTracker from '@/components/payments/PaymentScheduleTracker';

interface BookingDashboardProps {
  userId: string;
}

const BookingDashboard = ({ userId }: BookingDashboardProps) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['user-bookings-dashboard', userId, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          service_providers!inner (
            id,
            business_name,
            service_type,
            city,
            rating,
            profile_image
          ),
          payments (
            id,
            amount,
            payment_type,
            status,
            payment_description,
            created_at
          ),
          reviews (
            id,
            rating,
            comment,
            status
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: bookingStats } = useQuery({
    queryKey: ['user-booking-stats', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('status, total_amount')
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        total: data.length,
        confirmed: data.filter(b => b.status === 'confirmed').length,
        pending: data.filter(b => b.status === 'pending').length,
        completed: data.filter(b => b.status === 'completed').length,
        cancelled: data.filter(b => b.status === 'cancelled').length,
        totalSpent: data.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0)
      };

      return stats;
    },
    enabled: !!userId,
  });

  const filteredBookings = bookings?.filter(booking =>
    searchTerm === '' || 
    booking.service_providers.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.service_providers.service_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUpcomingBookings = () => {
    const today = new Date();
    return filteredBookings?.filter(booking => 
      new Date(booking.service_date) >= today && 
      (booking.status === 'confirmed' || booking.status === 'pending')
    ) || [];
  };

  const getPastBookings = () => {
    const today = new Date();
    return filteredBookings?.filter(booking => 
      new Date(booking.service_date) < today || 
      booking.status === 'completed' || 
      booking.status === 'cancelled'
    ) || [];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {bookingStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-ceremonial-maroon">{bookingStats.total}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{bookingStats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{bookingStats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-ceremonial-gold">₹{bookingStats.totalSpent.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by provider or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-ceremonial-gold" />
            Upcoming Bookings ({getUpcomingBookings().length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getUpcomingBookings().length === 0 ? (
            <p className="text-center text-gray-500 py-8">No upcoming bookings</p>
          ) : (
            <div className="space-y-4">
              {getUpcomingBookings().map((booking) => (
                <BookingCard key={booking.id} booking={booking} getStatusColor={getStatusColor} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            Past Bookings ({getPastBookings().length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getPastBookings().length === 0 ? (
            <p className="text-center text-gray-500 py-8">No past bookings</p>
          ) : (
            <div className="space-y-4">
              {getPastBookings().map((booking) => (
                <BookingCard key={booking.id} booking={booking} getStatusColor={getStatusColor} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface BookingCardProps {
  booking: any;
  getStatusColor: (status: string) => string;
}

const BookingCard = ({ booking, getStatusColor }: BookingCardProps) => {
  const totalPaid = booking.payments?.reduce((sum: number, payment: any) => 
    payment.status === 'completed' ? sum + Number(payment.amount) : sum, 0) || 0;
  
  const pendingAmount = (Number(booking.total_amount) || 0) - totalPaid;

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          {/* Provider Info */}
          <div className="flex items-start gap-3 flex-1">
            {booking.service_providers.profile_image && (
              <img
                src={booking.service_providers.profile_image}
                alt={booking.service_providers.business_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-ceremonial-maroon">
                {booking.service_providers.business_name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Badge variant="outline">{booking.service_providers.service_type}</Badge>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {booking.service_providers.city}
                </div>
                {booking.service_providers.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    {booking.service_providers.rating.toFixed(1)}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <div>📅 {format(new Date(booking.service_date), 'PPP')}</div>
                <div>🕐 {booking.time_slot}</div>
                {booking.special_requirements && (
                  <div className="mt-1">📝 {booking.special_requirements}</div>
                )}
              </div>
            </div>
          </div>

          {/* Status and Payment Info */}
          <div className="text-right space-y-2">
            <Badge className={`${getStatusColor(booking.status)} px-3 py-1`}>
              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
            </Badge>
            
            <div className="text-sm">
              <div className="flex items-center justify-end gap-1 text-ceremonial-gold">
                <DollarSign className="h-3 w-3" />
                <span className="font-semibold">₹{Number(booking.total_amount || 0).toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500">
                Paid: ₹{totalPaid.toLocaleString()}
              </div>
              {pendingAmount > 0 && (
                <div className="text-xs text-orange-600">
                  Pending: ₹{pendingAmount.toLocaleString()}
                </div>
              )}
            </div>

            {/* Review Status */}
            {booking.status === 'completed' && (
              <div className="text-xs">
                {booking.reviews?.length > 0 ? (
                  <span className="text-green-600">✓ Reviewed</span>
                ) : (
                  <span className="text-gray-500">Review Pending</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Schedule Tracker */}
        {booking.total_amount && (
          <div className="mt-4 pt-4 border-t">
            <PaymentScheduleTracker 
              bookingId={booking.id} 
              totalAmount={Number(booking.total_amount)} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingDashboard;