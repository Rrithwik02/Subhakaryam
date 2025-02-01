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
import { Calendar, Inbox, Clock } from "lucide-react";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ServiceDashboard = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();

  const { data: provider } = useQuery({
    queryKey: ["service-provider"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*, profiles(*)")
        .eq("profile_id", session?.user?.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch provider information",
        });
        return null;
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
        .from("service_requests")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
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
        return [];
      }

      return data;
    },
    enabled: !!provider,
  });

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
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Provider Info Card */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              {provider?.profile_image ? (
                <img 
                  src={provider.profile_image} 
                  alt={provider.business_name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-ceremonial-gold/20 flex items-center justify-center">
                  <span className="text-2xl font-display text-ceremonial-gold">
                    {provider?.business_name?.[0]}
                  </span>
                </div>
              )}
              <div>
                <CardTitle className="text-2xl font-display text-ceremonial-maroon">
                  {provider?.business_name}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {provider?.profiles?.email} • {provider?.city}
                </p>
              </div>
              <Badge 
                variant="outline" 
                className={`ml-auto ${
                  provider?.status === 'verified' 
                    ? 'border-green-500 text-green-500' 
                    : 'border-yellow-500 text-yellow-500'
                }`}
              >
                {provider?.status || 'Pending Verification'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-lg border">
            <TabsTrigger 
              value="requests"
              className="data-[state=active]:bg-ceremonial-gold data-[state=active]:text-white"
            >
              Service Requests
            </TabsTrigger>
            <TabsTrigger 
              value="availability"
              className="data-[state=active]:bg-ceremonial-gold data-[state=active]:text-white"
            >
              Availability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-display text-ceremonial-maroon flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requests && requests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Description</TableHead>
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
                            <TableCell>{request.description}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  request.status === "pending"
                                    ? "outline"
                                    : request.status === "accepted"
                                    ? "default"
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
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-ceremonial-gold hover:text-white transition-colors"
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <EmptyState />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-display text-ceremonial-maroon flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Manage Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                {provider && <AvailabilityCalendar providerId={provider.id} />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ServiceDashboard;