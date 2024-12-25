import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BookingsList from "@/components/profile/BookingsList";

const ServiceProviderProfile = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();

  const { data: provider, refetch: refetchProvider } = useQuery({
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
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch provider information",
        });
      },
    },
  });

  const updateProfileImage = useMutation({
    mutationFn: async (imageUrl: string) => {
      const { error } = await supabase
        .from("service_providers")
        .update({ profile_image: imageUrl })
        .eq("profile_id", session?.user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      refetchProvider();
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
              Service Provider Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProfileHeader
              businessName={provider?.business_name}
              rating={provider?.rating}
              basePrice={provider?.base_price}
              email={provider?.email}
              phone={provider?.phone}
              city={provider?.city}
              profileImage={provider?.profile_image}
              isServiceProvider={true}
              onImageUpload={(url) => updateProfileImage.mutate(url)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display text-ceremonial-maroon">
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BookingsList bookings={bookings} isServiceProvider />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;