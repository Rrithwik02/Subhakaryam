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
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();

  const { data: services, isLoading, refetch } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*, profiles(full_name, email)");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch services",
        });
        return [];
      }

      return data;
    },
  });

  const togglePremium = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("service_providers")
      .update({ is_premium: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service status",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Service status updated successfully",
    });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-ceremonial-gold" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-display font-bold text-ceremonial-maroon mb-6">
        Service Providers Management
      </h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Provider Name</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Premium Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services?.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.business_name}</TableCell>
                <TableCell>{service.profiles?.full_name}</TableCell>
                <TableCell className="capitalize">{service.service_type}</TableCell>
                <TableCell>{service.city}</TableCell>
                <TableCell>₹{service.base_price}</TableCell>
                <TableCell>{service.rating || "N/A"}</TableCell>
                <TableCell>
                  {service.is_premium ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePremium(service.id, !!service.is_premium)}
                  >
                    Toggle Premium
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;