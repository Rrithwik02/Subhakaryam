import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdditionalServiceForm from "./AdditionalServiceForm";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function ServicesManagement() {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: provider } = useQuery({
    queryKey: ["service-provider"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("profile_id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user,
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ["additional-services"],
    queryFn: async () => {
      if (!provider) return [];

      const { data, error } = await supabase
        .from("additional_services")
        .select("*")
        .eq("provider_id", provider.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!provider,
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const { error } = await supabase
        .from("additional_services")
        .delete()
        .eq("id", serviceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["additional-services"] });
      toast({
        title: "Service deleted",
        description: "The service has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service. Please try again.",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Manage Your Services</CardTitle>
            <AdditionalServiceForm providerId={provider?.id || ""} />
          </div>
        </CardHeader>
        <CardContent>
          {!services || services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No additional services added yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Add services to expand your offerings and reach more customers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Primary Service */}
              {provider && (
                <div className="border rounded-lg p-4 bg-primary/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg capitalize">
                        {provider.service_type.replace('_', ' ')} (Primary)
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{provider.description}</p>
                      <p className="text-ceremonial-gold font-medium">
                        ₹{provider.base_price?.toLocaleString()}
                      </p>
                      <Badge variant="default" className="mt-2">
                        {provider.status}
                      </Badge>
                    </div>
                    {provider.portfolio_images && provider.portfolio_images.length > 0 && (
                      <div className="w-32 h-20">
                        <Carousel className="w-full h-full">
                          <CarouselContent>
                            {provider.portfolio_images.map((image, index) => (
                              <CarouselItem key={index}>
                                <AspectRatio ratio={16 / 10} className="bg-muted">
                                  <img
                                    src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/portfolio_images/${image}`}
                                    alt={`Portfolio ${index + 1}`}
                                    className="object-cover w-full h-full rounded"
                                  />
                                </AspectRatio>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </Carousel>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Services Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Portfolio</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium capitalize">
                            {service.service_type.replace('_', ' ')}
                            {service.subcategory && (
                              <span className="text-sm text-gray-500 ml-1">
                                → {service.subcategory.replace('_', ' ')}
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-ceremonial-gold">
                          ₹{service.min_price?.toLocaleString()} - ₹{service.max_price?.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          service.status === 'approved' ? 'default' :
                          service.status === 'pending' ? 'secondary' :
                          'destructive'
                        }>
                          {service.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {service.portfolio_images && service.portfolio_images.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <Image className="h-4 w-4" />
                            <span className="text-sm">{service.portfolio_images.length}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteServiceMutation.mutate(service.id)}
                            disabled={deleteServiceMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}