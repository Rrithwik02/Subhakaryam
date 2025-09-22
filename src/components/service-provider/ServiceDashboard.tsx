import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Inbox, AlertCircle } from "lucide-react";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ChatInterface from "@/components/chat/ChatInterface";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentSettings } from "./PaymentSettings";
import { PaymentRequestDialog } from "./PaymentRequestDialog";
import { ServicesManagement } from "./ServicesManagement";
import { BundleManagement } from "../bundles/BundleManagement";

const ServiceDashboard = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { data: provider, isError: isProviderError } = useQuery({
    queryKey: ["service-provider"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select("id")
        .eq("profile_id", session?.user?.id)
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch provider information",
        });
        throw error;
      }

      return data;
    },
    enabled: !!session?.user,
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ["service-requests"],
    queryFn: async () => {
      if (!provider) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            phone
          ),
          service_providers!bookings_provider_id_fkey (
            service_type
          )
        `)
        .eq("provider_id", provider.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch service requests",
        });
        throw error;
      }

      return data;
    },
    enabled: !!provider,
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      // First, get the booking details
      const { data: booking, error: fetchError } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single();

      if (fetchError) throw fetchError;

      // Update the booking status
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);

      if (error) throw error;

      // If booking is being confirmed and payment preference is pay_now, trigger payment
      if (status === 'confirmed' && booking.payment_preference === 'pay_now') {
        // Get provider advance payment settings
        const { data: providerData, error: providerError } = await supabase
          .from("service_providers")
          .select("requires_advance_payment, advance_payment_percentage")
          .eq("id", booking.provider_id)
          .single();

        if (providerError) throw providerError;

        const paymentAmount = providerData.requires_advance_payment 
          ? Math.round((booking.total_amount * providerData.advance_payment_percentage) / 100)
          : booking.total_amount;
        const paymentType = providerData.requires_advance_payment ? 'advance' : 'final';

        // Create payment session
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-razorpay-checkout', {
          body: {
            bookingId: booking.id,
            paymentType,
            amount: paymentAmount,
          },
        });

        if (paymentError) {
          
          // Don't throw here - booking is confirmed, payment can be retried
        }

        return { booking, paymentData };
      }

      return { booking };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      
      if (data.paymentData) {
        toast({
          title: "Booking Confirmed",
          description: "Booking confirmed! Payment session has been created for the customer.",
        });
      } else {
        toast({
          title: "Success",
          description: "Booking status updated successfully",
        });
      }
    },
  });

  return (
    <div className={`container mx-auto ${isMobile ? 'p-4' : 'p-6'}`}>
      <h1 className={`font-bold mb-6 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Service Provider Dashboard</h1>
      
      {isProviderError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Provider Not Found</AlertTitle>
          <AlertDescription>
            You are not registered as a service provider. Please register first.
          </AlertDescription>
        </Alert>
      )}

      {!isProviderError && provider && (
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-5 ${isMobile ? 'h-12' : ''}`}>
            <TabsTrigger value="bookings" className={isMobile ? 'text-xs' : 'text-sm'}>
              {isMobile ? 'Bookings' : 'Bookings'}
            </TabsTrigger>
            <TabsTrigger value="services" className={isMobile ? 'text-xs' : 'text-sm'}>
              {isMobile ? 'Services' : 'Services'}
            </TabsTrigger>
            <TabsTrigger value="bundles" className={isMobile ? 'text-xs' : 'text-sm'}>
              {isMobile ? 'Bundles' : 'Bundles'}
            </TabsTrigger>
            <TabsTrigger value="availability" className={isMobile ? 'text-xs' : 'text-sm'}>
              {isMobile ? 'Schedule' : 'Availability'}
            </TabsTrigger>
            <TabsTrigger value="payment" className={isMobile ? 'text-xs' : 'text-sm'}>
              {isMobile ? 'Payment' : 'Payment'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Service Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading requests...</p>
                ) : !requests || requests.length === 0 ? (
                  <div className="text-center py-8">
                    <Inbox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                    <p className="text-gray-500">When customers book your services, they'll appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request: any) => {
                      const profile = request.profiles;
                      return (
                        <div key={request.id} className={`border rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                          <div className={`flex items-start mb-2 ${isMobile ? 'flex-col space-y-2' : 'justify-between'}`}>
                            <div>
                              <h4 className="font-semibold">{profile?.full_name}</h4>
                              <p className="text-sm text-gray-600">{profile?.email}</p>
                              {profile?.phone && (
                                <p className="text-sm text-gray-600">{profile.phone}</p>
                              )}
                            </div>
                            <Badge variant={
                              request.status === 'confirmed' ? 'default' :
                              request.status === 'pending' ? 'secondary' :
                              request.status === 'cancelled' ? 'destructive' :
                              'outline'
                            }>
                              {request.status}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-3">
                            <p>Service Date: {format(new Date(request.service_date), "PPP")}</p>
                            <p>Time: {request.time_slot}</p>
                            {request.special_requirements && (
                              <p>Requirements: {request.special_requirements}</p>
                            )}
                            <p>Total Amount: ₹{request.total_amount}</p>
                            {request.total_days > 1 && (
                              <p>Duration: {request.total_days} days</p>
                            )}
                          </div>

                          <div className={`gap-2 ${isMobile ? 'grid grid-cols-1 space-y-2' : 'flex'}`}>
                            {request.status === 'pending' && (
                              <>
                                <Button
                                  size={isMobile ? 'default' : 'sm'}
                                  onClick={() => updateBookingStatus.mutate({ 
                                    bookingId: request.id, 
                                    status: 'confirmed' 
                                  })}
                                  disabled={updateBookingStatus.isPending}
                                  className={isMobile ? 'w-full' : ''}
                                >
                                  Accept
                                </Button>
                                <Button
                                  size={isMobile ? 'default' : 'sm'}
                                  variant="destructive"
                                  onClick={() => updateBookingStatus.mutate({ 
                                    bookingId: request.id, 
                                    status: 'rejected' 
                                  })}
                                  disabled={updateBookingStatus.isPending}
                                  className={isMobile ? 'w-full' : ''}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            {request.status === 'confirmed' && (
                              <>
                                <Button
                                  size={isMobile ? 'default' : 'sm'}
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedChat(request.id);
                                  }}
                                  className={isMobile ? 'w-full' : ''}
                                >
                                  {isMobile ? 'Chat' : 'Chat with Customer'}
                                </Button>
                                
                                <PaymentRequestDialog booking={request}>
                                  <Button 
                                    size={isMobile ? 'default' : 'sm'}
                                    className={isMobile ? 'w-full' : ''}
                                  >
                                    {isMobile ? 'Payment' : 'Request Payment'}
                                  </Button>
                                </PaymentRequestDialog>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <ServicesManagement />
          </TabsContent>

          <TabsContent value="bundles">
            <BundleManagement />
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Manage Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <AvailabilityCalendar providerId={provider.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <PaymentSettings />
          </TabsContent>
        </Tabs>
      )}

      {/* Chat Interface Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg flex flex-col ${
            isMobile 
              ? 'w-full h-full rounded-none' 
              : 'w-full max-w-2xl h-3/4'
          }`}>
            <div className={`border-b flex justify-between items-center ${isMobile ? 'p-3' : 'p-4'}`}>
              <h3 className={`font-semibold ${isMobile ? 'text-base' : ''}`}>
                {isMobile ? 'Chat' : 'Customer Chat'}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedChat(null)}
              >
                ×
              </Button>
            </div>
            <div className="flex-1">
              <ChatInterface 
                bookingId={selectedChat} 
                receiverId={requests?.find(r => r.id === selectedChat)?.user_id || ""} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDashboard;