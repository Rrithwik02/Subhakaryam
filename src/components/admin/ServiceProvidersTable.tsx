
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, CreditCard, Image } from "lucide-react";

const ServiceProvidersTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedAdditionalService, setSelectedAdditionalService] = useState<any>(null);

  const { data: providers, isLoading } = useQuery({
    queryKey: ["service-providers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select(`
          *,
          profiles:profile_id (
            full_name,
            email,
            phone
          ),
          additional_services (
            id,
            service_type,
            description,
            status
          ),
          provider_payment_details (
            payment_method,
            account_holder_name,
            bank_name,
            account_number,
            ifsc_code,
            upi_id,
            qr_code_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("service_providers")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-providers"] });
      toast({
        title: "Success",
        description: "Provider status updated successfully",
      });
      setSelectedProvider(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update provider status",
      });
    },
  });

  const updateAdditionalServiceStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("additional_services")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-providers"] });
      toast({
        title: "Success",
        description: "Additional service status updated successfully",
      });
      setSelectedAdditionalService(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update additional service status",
      });
    },
  });

  const deleteProvider = useMutation({
    mutationFn: async (providerId: string) => {
      // First get the profile_id
      const { data: provider, error: fetchError } = await supabase
        .from("service_providers")
        .select("profile_id")
        .eq("id", providerId)
        .single();

      if (fetchError) throw fetchError;

      // Delete the service provider
      const { error: deleteError } = await supabase
        .from("service_providers")
        .delete()
        .eq("id", providerId);

      if (deleteError) throw deleteError;

      // Delete the user from auth.users using admin client
      if (provider.profile_id) {
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
          provider.profile_id
        );
        if (authError) throw authError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-providers"] });
      toast({
        title: "Success",
        description: "Service provider deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service provider",
      });
      console.error("Delete provider error:", error);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Contact Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers?.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell className="font-medium">
                {provider.business_name}
                {provider.additional_services?.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    +{provider.additional_services.length} additional
                  </Badge>
                )}
              </TableCell>
              <TableCell className="capitalize">{provider.service_type}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{provider.profiles?.full_name}</p>
                  <p className="text-sm text-gray-500">{provider.profiles?.email}</p>
                  <p className="text-sm text-gray-500">{provider.profiles?.phone}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    provider.status === "approved"
                      ? "secondary"
                      : provider.status === "rejected"
                      ? "destructive"
                      : "default"
                  }
                >
                  {provider.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-x-2">
                  {provider.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => setSelectedProvider(provider)}
                      className="bg-ceremonial-gold hover:bg-ceremonial-gold/90"
                    >
                      Review
                    </Button>
                  )}
                  {provider.additional_services?.some(
                    (service: any) => service.status === "pending"
                  ) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAdditionalService(provider)}
                    >
                      Review Additional Services
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the service
                          provider account and all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteProvider.mutate(provider.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Provider Review Dialog */}
      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-ceremonial-maroon">
              Review Service Provider Application
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-ceremonial-maroon">Business Details</h3>
              <p>Name: {selectedProvider?.business_name}</p>
              <p>Service: {selectedProvider?.service_type}</p>
              <p>City: {selectedProvider?.city}</p>
              <p>Description: {selectedProvider?.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-ceremonial-maroon">Contact Information</h3>
              <p>Name: {selectedProvider?.profiles?.full_name}</p>
              <p>Email: {selectedProvider?.profiles?.email}</p>
              <p>Phone: {selectedProvider?.profiles?.phone}</p>
            </div>
            
            {selectedProvider?.portfolio_images?.length > 0 && (
              <div>
                <h3 className="font-semibold text-ceremonial-maroon mb-3 flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Portfolio Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedProvider.portfolio_images.map((image: string, index: number) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProvider?.provider_payment_details && (
              <div>
                <h3 className="font-semibold text-ceremonial-maroon flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </h3>
                {selectedProvider.provider_payment_details.payment_method === 'bank_account' && (
                  <div className="space-y-2 mt-3">
                    <p>Payment Method: Bank Account</p>
                    <p>Account Holder: {selectedProvider.provider_payment_details.account_holder_name}</p>
                    <p>Bank Name: {selectedProvider.provider_payment_details.bank_name}</p>
                    <p>Account Number: {selectedProvider.provider_payment_details.account_number}</p>
                    <p>IFSC Code: {selectedProvider.provider_payment_details.ifsc_code}</p>
                  </div>
                )}
                
                {selectedProvider.provider_payment_details.payment_method === 'upi' && (
                  <div className="space-y-2 mt-3">
                    <p>Payment Method: UPI</p>
                    <p>UPI ID: {selectedProvider.provider_payment_details.upi_id}</p>
                  </div>
                )}
                
                {selectedProvider.provider_payment_details.payment_method === 'qr_code' && (
                  <div className="space-y-2 mt-3">
                    <p>Payment Method: QR Code</p>
                    {selectedProvider.provider_payment_details.qr_code_url && (
                      <div className="w-48 h-48 relative">
                        <img
                          src={selectedProvider.provider_payment_details.qr_code_url}
                          alt="Payment QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="destructive"
              onClick={() =>
                updateStatus.mutate({
                  id: selectedProvider?.id,
                  status: "rejected",
                })
              }
            >
              Reject
            </Button>
            <Button
              className="bg-ceremonial-gold hover:bg-ceremonial-gold/90"
              onClick={() =>
                updateStatus.mutate({
                  id: selectedProvider?.id,
                  status: "approved",
                })
              }
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Additional Services Review Dialog */}
      <Dialog
        open={!!selectedAdditionalService}
        onOpenChange={() => setSelectedAdditionalService(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-ceremonial-maroon">
              Review Additional Services
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedAdditionalService?.additional_services
              ?.filter((service: any) => service.status === "pending")
              .map((service: any) => (
                <div key={service.id} className="border p-4 rounded-lg">
                  <h3 className="font-semibold text-ceremonial-maroon">
                    {service.service_type}
                  </h3>
                  <p className="text-gray-600 mt-2">{service.description}</p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        updateAdditionalServiceStatus.mutate({
                          id: service.id,
                          status: "rejected",
                        })
                      }
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-ceremonial-gold hover:bg-ceremonial-gold/90"
                      onClick={() =>
                        updateAdditionalServiceStatus.mutate({
                          id: service.id,
                          status: "approved",
                        })
                      }
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceProvidersTable;
