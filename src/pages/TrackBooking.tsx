import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Calendar, MapPin, User, Phone, Mail, Clock } from "lucide-react";
import { format } from "date-fns";

const TrackBooking = () => {
  const { session } = useSessionContext();
  const [bookingId, setBookingId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user's bookings
  const { data: userBookings, isLoading: loadingUserBookings } = useQuery({
    queryKey: ["user-bookings", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return [];
      
      const { data, error } = await supabase
        .from("service_requests")
        .select(`
          *,
          service_providers (
            business_name,
            contact_phone,
            profiles (email)
          )
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user,
  });

  // Search for specific booking by ID
  const { data: searchedBooking, isLoading: loadingSearch } = useQuery({
    queryKey: ["booking-search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;
      
      const { data, error } = await supabase
        .from("service_requests")
        .select(`
          *,
          service_providers (
            business_name,
            contact_phone,
            profiles (email)
          )
        `)
        .eq("id", searchQuery.trim())
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!searchQuery.trim(),
  });

  const handleSearch = () => {
    setSearchQuery(bookingId);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-display text-foreground">
              Booking #{booking.id.slice(-8)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Service: {booking.service_type || 'N/A'}
            </p>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status || 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Event Date: {booking.event_date ? format(new Date(booking.event_date), 'PPP') : 'Not set'}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Location: {booking.location || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Created: {format(new Date(booking.created_at), 'PPP')}</span>
          </div>
          {booking.service_providers && (
            <div className="flex items-center gap-2 text-foreground">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Provider: {booking.service_providers.business_name || 'Unassigned'}</span>
            </div>
          )}
        </div>
        
        {booking.description && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Description:</h4>
              <p className="text-sm text-muted-foreground">{booking.description}</p>
            </div>
          </>
        )}
        
        {booking.service_providers && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Provider Contact:</h4>
              {booking.service_providers.contact_phone && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.service_providers.contact_phone}</span>
                </div>
              )}
              {booking.service_providers.profiles?.email && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.service_providers.profiles.email}</span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-display text-foreground mb-4">Track Your Bookings</h1>
            <p className="text-muted-foreground">
              Monitor your service requests and stay updated on their status
            </p>
          </div>

          {/* Search by Booking ID */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display text-foreground">Search Specific Booking</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your booking ID to track a specific request
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter booking ID..."
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="flex-1 bg-background border-border text-foreground"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={!bookingId.trim() || loadingSearch}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchQuery && (
            <div>
              <h2 className="text-xl font-display text-foreground mb-4">Search Results</h2>
              {loadingSearch ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : searchedBooking ? (
                <BookingCard booking={searchedBooking} />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      No booking found with ID: {searchQuery}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* User's Bookings */}
          {session && (
            <div>
              <h2 className="text-xl font-display text-foreground mb-4">Your Recent Bookings</h2>
              {loadingUserBookings ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : userBookings && userBookings.length > 0 ? (
                <div className="space-y-4">
                  {userBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      You haven't made any bookings yet.
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/services'} 
                      className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Browse Services
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!session && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Please sign in to view your bookings
                </p>
                <Button 
                  onClick={() => window.location.href = '/auth/login'} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Sign In
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackBooking;