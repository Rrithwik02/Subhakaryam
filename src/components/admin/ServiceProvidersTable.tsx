
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
import { Trash2, Building2, User, MapPin, CreditCard } from "lucide-react";

const ServiceProvidersTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

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
          provider_payment_details!provider_payment_details_provider_id_fkey (
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

  const deleteProvider = useMutation({
    mutationFn: async (providerId: string) => {
      const { data: provider, error: fetchError } = await supabase
        .from("service_providers")
        .select("profile_id")
        .eq("id", providerId)
        .single();

      if (fetchError) throw fetchError;

      const { error: deleteError } = await supabase
        .from("service_providers")
        .delete()
        .eq("id", providerId);

      if (deleteError) throw deleteError;

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

      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-ceremonial-maroon">
              Review Service Provider Application
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-ceremonial-maroon flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Business Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Business Name</p>
                      <p className="font-medium">{selectedProvider?.business_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Service Type</p>
                      <p className="font-medium capitalize">{selectedProvider?.service_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium">{selectedProvider?.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Base Price</p>
                      <p className="font-medium">₹{selectedProvider?.base_price}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{selectedProvider?.description || "No description provided"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-ceremonial-maroon flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedProvider?.profiles?.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedProvider?.profiles?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedProvider?.profiles?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-ceremonial-maroon flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Portfolio Images
                  </h3>
                  {selectedProvider?.portfolio_images && selectedProvider.portfolio_images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedProvider.portfolio_images.map((image: string, index: number) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border shadow-sm"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 py-4">No portfolio images provided</p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-ceremonial-maroon">
                    Portfolio Link
                  </h3>
                  {selectedProvider?.portfolio_link ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <a 
                        href={selectedProvider.portfolio_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ceremonial-gold hover:underline font-medium break-all"
                      >
                        {selectedProvider.portfolio_link}
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-500 py-4">No portfolio link provided</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment">
              <div className="space-y-4">
                <h3 className="font-semibold text-ceremonial-maroon flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </h3>
                {selectedProvider?.provider_payment_details ? (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-500 capitalize">
                      Payment Method: {selectedProvider.provider_payment_details.payment_method}
                    </p>
                    
                    {selectedProvider.provider_payment_details.payment_method === "bank_account" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Account Holder Name</p>
                          <p className="font-medium">
                            {selectedProvider.provider_payment_details.account_holder_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Bank Name</p>
                          <p className="font-medium">
                            {selectedProvider.provider_payment_details.bank_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Account Number</p>
                          <p className="font-medium">
                            {selectedProvider.provider_payment_details.account_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">IFSC Code</p>
                          <p className="font-medium">
                            {selectedProvider.provider_payment_details.ifsc_code}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedProvider.provider_payment_details.payment_method === "upi" && (
                      <div>
                        <p className="text-sm text-gray-500">UPI ID</p>
                        <p className="font-medium">
                          {selectedProvider.provider_payment_details.upi_id}
                        </p>
                      </div>
                    )}

                    {selectedProvider.provider_payment_details.payment_method === "qr_code" && (
                      <div>
                        <p className="text-sm text-gray-500">QR Code</p>
                        {selectedProvider.provider_payment_details.qr_code_url ? (
                          <img
                            src={selectedProvider.provider_payment_details.qr_code_url}
                            alt="Payment QR Code"
                            className="max-w-[200px] mt-2 border rounded-lg"
                          />
                        ) : (
                          <p className="text-gray-500">No QR code provided</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 py-4">No payment details provided</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-end space-x-2 mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Reject</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Service Provider?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject this service provider? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      updateStatus.mutate({
                        id: selectedProvider?.id,
                        status: "rejected",
                      })
                    }
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-ceremonial-gold hover:bg-ceremonial-gold/90">
                  Approve
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve Service Provider?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve this service provider?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      updateStatus.mutate({
                        id: selectedProvider?.id,
                        status: "approved",
                      })
                    }
                    className="bg-ceremonial-gold hover:bg-ceremonial-gold/90"
                  >
                    Approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceProvidersTable;
