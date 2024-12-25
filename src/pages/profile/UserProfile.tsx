import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";

const UserProfile = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!session?.user,
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile information",
        });
      },
    },
  });

  const updateProfileImage = useMutation({
    mutationFn: async (imageUrl: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ profile_image: imageUrl })
        .eq("id", session?.user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      refetchProfile();
    },
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update profile image",
        });
      },
    },
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
        throw error;
      }

      return data;
    },
    enabled: !!session?.user,
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch booking information",
        });
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display text-ceremonial-maroon">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProfileHeader
              businessName={profile?.full_name}
              email={profile?.email}
              phone={profile?.phone}
              profileImage={profile?.profile_image}
              onImageUpload={(url) => updateProfileImage.mutate(url)}
            />
          </CardContent>
        </Card>

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
                          <span>
                            {new Date(booking.service_date).toLocaleDateString()}
                          </span>
                          <span>
                            {new Date(`2000-01-01T${booking.time_slot}`).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded text-sm capitalize">
                        {booking.status}
                      </div>
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