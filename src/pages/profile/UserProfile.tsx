import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Phone, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

const UserProfile = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile information",
        });
        return null;
      }

      return data;
    },
    enabled: !!session?.user,
  });

  const { data: bookings } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          service_providers (
            business_name,
            service_type
          )
        `)
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch booking information",
        });
        return [];
      }

      return data;
    },
    enabled: !!session?.user,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display text-ceremonial-maroon">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{profile?.full_name}</h2>
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                  <Mail className="h-4 w-4" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{profile?.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{profile?.address || "Not provided"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display text-ceremonial-maroon">
              My Bookings
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
                          {booking.service_providers?.business_name}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {booking.service_providers?.service_type}
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

export default UserProfile;