
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";
import NotificationPreferences from "@/components/notifications/NotificationPreferences";
import ThemeCustomizer from "@/components/theme/ThemeCustomizer";
import ChatInterface from "@/components/chat/ChatInterface";
import PaymentRequestButton from "@/components/payments/PaymentRequestButton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LogOut, MessageCircle, Calendar, CreditCard, AlertCircle, Quote } from "lucide-react";
import { useState } from "react";
import BookingDashboard from "@/components/profile/BookingDashboard";

const UserProfile = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

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
          ),
          payments (
            id,
            amount,
            payment_type,
            status,
            payment_description,
            is_provider_requested,
            created_at
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
      navigate('/auth/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white p-4 md:p-8">
      <div className="mx-auto space-y-6 max-w-none md:max-w-6xl md:space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl md:text-3xl font-display text-ceremonial-maroon text-center md:text-left">
            Your Profile
          </h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl font-display text-ceremonial-maroon">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <ProfileHeader
              businessName={profile?.full_name}
              email={profile?.email}
              phone={profile?.phone}
              profileImage={profile?.profile_image}
              onImageUpload={(url) => updateProfileImage.mutate(url)}
            />
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="quotations">
              <Quote className="w-4 h-4 mr-2" />
              Quotations
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="themes">
              Themes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <BookingDashboard userId={session?.user?.id || ''} />
          </TabsContent>

          <TabsContent value="quotations">
            <div className="text-center py-8 text-gray-500">
              Quotation system coming soon...
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
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
                        className="cursor-pointer hover:bg-gray-50 transition-colors" 
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
                            <Button variant="secondary" size="sm">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Open Chat
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationPreferences />
          </TabsContent>

          <TabsContent value="themes">
            <ThemeCustomizer />
          </TabsContent>
        </Tabs>

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
