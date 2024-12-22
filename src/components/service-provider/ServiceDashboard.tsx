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

const ServiceDashboard = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["service-requests"],
    queryFn: async () => {
      const { data: provider } = await supabase
        .from("service_providers")
        .select("id")
        .eq("profile_id", session?.user?.id)
        .single();

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
    enabled: !!session?.user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-3xl font-display font-bold text-ceremonial-maroon">
          Service Requests
        </h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
              {requests?.map((request) => (
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
                          ? "success"
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
              {requests?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No service requests yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ServiceDashboard;