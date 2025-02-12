import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const ServiceDashboard = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

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
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    },
  });

  if (isProviderError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load service provider information. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>
              No service provider profile found. Please complete your registration first.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <Inbox className="h-16 w-16 mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Service Requests Yet</h3>
      <p className="text-sm text-center max-w-md">
        When customers request your services, they will appear here. Make sure your profile is complete to attract more customers.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-ceremonial-maroon">
            Service Provider Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your bookings and availability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-display text-ceremonial-maroon">
                  Service Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requests && requests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Special Requirements</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested On</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.profiles?.full_name}</TableCell>
                          <TableCell>{request.profiles?.email}</TableCell>
                          <TableCell className="capitalize">
                            {request.service_providers?.service_type}
                          </TableCell>
                          <TableCell>{request.special_requirements}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                request.status === "pending"
                                  ? "default"
                                  : request.status === "accepted"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(request.created_at), "PPp")}
                          </TableCell>
                          <TableCell>
                            <div className="space-x-2">
                              {request.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-ceremonial-gold hover:text-white transition-colors"
                                    onClick={() =>
                                      updateBookingStatus.mutate({
                                        bookingId: request.id,
                                        status: "accepted",
                                      })
                                    }
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      updateBookingStatus.mutate({
                                        bookingId: request.id,
                                        status: "rejected",
                                      })
                                    }
                                  >
                                    Decline
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedChat(request.id)}
                                disabled={new Date(request.service_date) < new Date()}
                              >
                                Chat
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState />
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-display text-ceremonial-maroon">
                  {selectedChat ? "Chat" : "Availability"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedChat ? (
                  <ChatInterface
                    bookingId={selectedChat}
                    receiverId={requests?.find(r => r.id === selectedChat)?.user_id || ""}
                    isDisabled={requests?.find(r => r.id === selectedChat)?.service_date < new Date().toISOString()}
                  />
                ) : (
                  <AvailabilityCalendar providerId={provider?.id} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDashboard;
