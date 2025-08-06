import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdditionalServiceReviewDialog } from "./AdditionalServiceReviewDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdditionalServicesTable() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: additionalServices, isLoading } = useQuery({
    queryKey: ["additional-services-admin", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("additional_services")
        .select(`
          *,
          service_providers!inner(
            business_name,
            profiles!inner(
              full_name,
              email
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ serviceId, status, adminNotes }: { serviceId: string; status: string; adminNotes?: string }) => {
      const { error } = await supabase
        .from("additional_services")
        .update({ 
          status,
          ...(adminNotes && { admin_notes: adminNotes })
        })
        .eq("id", serviceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["additional-services-admin"] });
      toast({
        title: "Success",
        description: "Service status updated successfully",
      });
      setSelectedService(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading additional services...</div>;
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Additional Services</h3>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[70vh]">
          <div className="space-y-4">
            {additionalServices?.map((service) => (
              <Card key={service.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{service.service_type}</h4>
                      {service.subcategory && (
                        <p className="text-sm text-muted-foreground">{service.subcategory}</p>
                      )}
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                  
                  <div className="text-sm">
                    <p><strong>Provider:</strong> {service.service_providers.business_name}</p>
                    <p><strong>Contact:</strong> {service.service_providers.profiles.full_name}</p>
                    <p><strong>Price:</strong> ₹{service.min_price} - ₹{service.max_price}</p>
                    <p><strong>Images:</strong> {service.portfolio_images?.length || 0}</p>
                  </div>

                  <Button
                    onClick={() => setSelectedService(service)}
                    variant="outline"
                    className="w-full"
                  >
                    Review Service
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {selectedService && (
          <AdditionalServiceReviewDialog
            service={selectedService}
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            onUpdateStatus={updateServiceMutation.mutate}
            isUpdating={updateServiceMutation.isPending}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Additional Services Management</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="pending">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service Type</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Price Range</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {additionalServices?.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{service.service_type}</div>
                  {service.subcategory && (
                    <div className="text-sm text-muted-foreground">{service.subcategory}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{service.service_providers.business_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {service.service_providers.profiles.full_name}
                  </div>
                </div>
              </TableCell>
              <TableCell>₹{service.min_price} - ₹{service.max_price}</TableCell>
              <TableCell>{service.portfolio_images?.length || 0} images</TableCell>
              <TableCell>{getStatusBadge(service.status)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => setSelectedService(service)}
                  variant="outline"
                  size="sm"
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedService && (
        <AdditionalServiceReviewDialog
          service={selectedService}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          onUpdateStatus={updateServiceMutation.mutate}
          isUpdating={updateServiceMutation.isPending}
        />
      )}
    </div>
  );
}