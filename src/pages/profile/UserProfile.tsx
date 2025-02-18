
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";
import ChatInterface from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useState } from "react";

const UserProfile = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

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
  });

  const { data: bookings, refetch: refetchBookings } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          service_providers (
            id,
            business_name,
            service_type,
            profile_id
          )
        `)
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user,
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display text-ceremonial-maroon">Your Profile</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display text-ceremonial-maroon">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
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
              Messages & Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bookings">
              <TabsList className="w-full">
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bookings">
                <div className="space-y-4">
                  {bookings?.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">
                              {booking.service_providers?.business_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.service_date).toLocaleDateString()} at{" "}
                              {new Date(`2000-01-01T${booking.time_slot}`).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="mt-1 text-sm capitalize">
                              Status: <span className="font-medium">{booking.status}</span>
                            </p>
                          </div>
                          {booking.status !== "cancelled" && (
                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                onClick={() => setSelectedChat(booking.id)}
                              >
                                Open Chat
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="messages">
                {selectedChat ? (
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedChat(null)}
                      className="mb-4"
                    >
                      Back to Messages
                    </Button>
                    <ChatInterface
                      bookingId={selectedChat}
                      receiverId={bookings?.find(b => b.id === selectedChat)?.service_providers?.profile_id || ""}
                      isDisabled={false}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings?.filter(b => b.status !== "cancelled").map((booking) => (
                      <Card 
                        key={booking.id} 
                        className="cursor-pointer hover:bg-gray-50" 
                        onClick={() => setSelectedChat(booking.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">
                                {booking.service_providers?.business_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(booking.service_date).toLocaleDateString()}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Open Chat
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-red-600">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeleteAccountButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
