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
import { Check, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceProvidersTable = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { 
    data: services, 
    isLoading: isLoadingServices, 
    refetch: refetchServices 
  } = useQuery({
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
    refetchServices();
  };

  if (isLoadingServices) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => navigate("/register/service-provider")}
          className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Service Provider
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-lg border bg-white shadow">
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
              <TableRow key={service.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{service.business_name}</TableCell>
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
                    className="hover:bg-ceremonial-gold hover:text-white transition-colors"
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

export default ServiceProvidersTable;