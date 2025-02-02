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
import { Inbox } from "lucide-react";
import AvailabilityCalendar from "./AvailabilityCalendar";

const ServiceDashboard = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();

  const { data: provider } = useQuery({
    queryKey: ["service-provider"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select("id")
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-display font-bold text-ceremonial-maroon mb-6">
              Service Requests
            </h2>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {requests && requests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Service Type</TableHead>
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
                        <TableCell className="capitalize">{request.service_type}</TableCell>
                        <TableCell>{request.description}</TableCell>
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
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
          
          <div>
            {provider && <AvailabilityCalendar providerId={provider.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDashboard;