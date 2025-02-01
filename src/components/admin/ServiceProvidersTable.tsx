import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Check, Plus, X, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const ServiceProvidersTable = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { 
    data: services, 
    isLoading: isLoadingServices,
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

  const verifyProvider = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("service_providers")
        .update({ status: 'verified' })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast({
        title: "Success",
        description: "Service provider verified successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify service provider",
      });
    },
  });

  const togglePremium = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: boolean }) => {
      const { error } = await supabase
        .from("service_providers")
        .update({ is_premium: !currentStatus })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast({
        title: "Success",
        description: "Premium status updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update premium status",
      });
    },
  });

  if (isLoadingServices) {
    return (
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-ceremonial-maroon">
          Service Providers
        </h3>
        <Button
          onClick={() => navigate("/register/service-provider")}
          className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Provider Name</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Premium</TableHead>
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
                  <Badge
                    variant={service.status === 'verified' ? 'default' : 'secondary'}
                    className={service.status === 'verified' ? 'bg-green-500' : 'bg-yellow-500'}
                  >
                    {service.status || 'pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {service.is_premium ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {service.status !== 'verified' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => verifyProvider.mutate(service.id)}
                        className="hover:bg-green-500 hover:text-white transition-colors"
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePremium.mutate({ 
                        id: service.id, 
                        currentStatus: !!service.is_premium 
                      })}
                      className="hover:bg-ceremonial-gold hover:text-white transition-colors"
                    >
                      Toggle Premium
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ServiceProvidersTable;