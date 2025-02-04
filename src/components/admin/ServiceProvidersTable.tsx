import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
              <TableCell>{provider.business_name}</TableCell>
              <TableCell className="capitalize">{provider.service_type}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p>{provider.profiles?.full_name}</p>
                  <p className="text-sm text-gray-500">{provider.profiles?.email}</p>
                  <p className="text-sm text-gray-500">{provider.profiles?.phone}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    provider.status === "approved"
                      ? "success"
                      : provider.status === "rejected"
                      ? "destructive"
                      : "default"
                  }
                >
                  {provider.status}
                </Badge>
              </TableCell>
              <TableCell>
                {provider.status === "pending" && (
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedProvider(provider)}
                    >
                      Review
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Service Provider Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Business Details</h3>
              <p>Name: {selectedProvider?.business_name}</p>
              <p>Service: {selectedProvider?.service_type}</p>
              <p>City: {selectedProvider?.city}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact Information</h3>
              <p>Name: {selectedProvider?.profiles?.full_name}</p>
              <p>Email: {selectedProvider?.profiles?.email}</p>
              <p>Phone: {selectedProvider?.profiles?.phone}</p>
            </div>
          </div>
          <DialogFooter className="space-x-2">
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
    </div>
  );
};

export default ServiceProvidersTable;