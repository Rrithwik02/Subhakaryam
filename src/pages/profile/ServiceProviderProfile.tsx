
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BookingsList from "@/components/profile/BookingsList";
import ChatInterface from "@/components/chat/ChatInterface";
import { X } from "lucide-react";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ServiceProviderProfile = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get('id');

  const { data: provider, refetch: refetchProvider } = useQuery({
    queryKey: ["service-provider-profile", providerId],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", providerId || session?.user?.id)
        .single();

      if (profileError) throw profileError;

      const { data: provider, error: providerError } = await supabase
        .from("service_providers")
        .select("*")
        .eq("profile_id", providerId || session?.user?.id)
        .single();

      if (providerError) throw providerError;

      return { ...provider, ...profile };
    },
    enabled: !!(session?.user || providerId),
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
    queryKey: ["provider-bookings", provider?.id],
    queryFn: async () => {
      if (!provider?.id) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            email
          ),
          service_providers!inner (
            profile_id
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

  const deletePortfolioImage = useMutation({
    mutationFn: async (imageUrlToDelete: string) => {
      const currentImages = provider?.portfolio_images || [];
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

  const isOwnProfile = provider?.profile_id === session?.user?.id;

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
              onImageUpload={isOwnProfile ? (url) => updateProfileImage.mutate(url) : undefined}
            />
            
            {isOwnProfile && (
              <div className="mt-8">
                <DeleteAccountButton />
              </div>
            )}

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
                      {isOwnProfile && (
                        <button
                          onClick={() => deletePortfolioImage.mutate(image)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {(isOwnProfile || session?.user) && bookings && bookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-display text-ceremonial-maroon">
                {isOwnProfile ? "Dashboard" : "Interaction"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="bookings">
                <TabsList className="w-full">
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bookings">
                  <BookingsList bookings={bookings} isServiceProvider={isOwnProfile} />
                </TabsContent>
                
                <TabsContent value="messages">
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <ChatInterface
                        key={booking.id}
                        bookingId={booking.id}
                        receiverId={isOwnProfile 
                          ? booking.profiles?.id 
                          : booking.service_providers?.profile_id || ''}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderProfile;
