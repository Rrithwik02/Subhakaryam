import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BookingsList from "@/components/profile/BookingsList";
import { X } from "lucide-react";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";

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

  const deletePortfolioImage = useMutation({
    mutationFn: async (imageUrlToDelete: string) => {
      // Get current portfolio images
      const currentImages = provider?.portfolio_images || [];
      
      // Filter out the image to delete
      const updatedImages = currentImages.filter(url => url !== imageUrlToDelete);
      
      const { error } = await supabase
        .from("service_providers")
        .update({ portfolio_images: updatedImages })
        .eq("profile_id", session?.user?.id);

      if (error) throw error;
      
      return updatedImages;
    },
    onSuccess: () => {
      refetchProvider();
      toast({
        title: "Success",
        description: "Portfolio image deleted successfully",
      });
    },
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete portfolio image",
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
            <div className="mt-8">
              <DeleteAccountButton />
            </div>

            {provider?.portfolio_images && provider.portfolio_images.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ceremonial-maroon">Portfolio Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {provider.portfolio_images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => deletePortfolioImage.mutate(image)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
