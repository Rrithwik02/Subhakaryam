import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  DollarSign,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

const ServiceProviderProfile = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();

  const { data: provider } = useQuery({
    queryKey: ["service-provider-profile"],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (profileError) throw profileError;

      const { data: provider, error: providerError } = await supabase
        .from("service_providers")
        .select("*")
        .eq("profile_id", session?.user?.id)
        .single();

      if (providerError) throw providerError;

      return { ...provider, ...profile };
    },
    enabled: !!session?.user,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch provider information",
      });
    },
  });

  const { data: bookings } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: async () => {
      if (!provider?.id) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq("provider_id", provider.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!provider?.id,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch booking information",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display text-ceremonial-maroon">
              Service Provider Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {provider?.business_name?.charAt(0) || "SP"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">
                  {provider?.business_name}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span>{provider?.rating || "No ratings"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span>₹{provider?.base_price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{provider?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{provider?.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{provider?.city}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display text-ceremonial-maroon">
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings?.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {booking.profiles?.full_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {booking.profiles?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(booking.service_date), "PPP")}
                          </span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>
                            {format(new Date(`2000-01-01T${booking.time_slot}`), "p")}
                          </span>
                        </div>
                        {booking.special_requirements && (
                          <p className="mt-2 text-sm text-gray-600">
                            <strong>Special Requirements:</strong>{" "}
                            {booking.special_requirements}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          booking.status === "pending"
                            ? "default"
                            : booking.status === "confirmed"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!bookings || bookings.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No bookings found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;