
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

interface DeletionRequest {
  id: string;
  user_id: string;
  reason: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
    user_type: string | null;
  };
}

const DeletionRequestsTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["deletion-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("account_deletion_requests")
        .select(`
          *,
          profiles:profiles!user_id(
            full_name,
            email,
            user_type
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as DeletionRequest[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("account_deletion_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletion-requests"] });
      toast({
        title: "Success",
        description: "Request status updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update request status",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ceremonial-maroon">
        Account Deletion Requests
      </h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{request.profiles?.full_name}</p>
                  <p className="text-sm text-gray-500">{request.profiles?.email}</p>
                </div>
              </TableCell>
              <TableCell className="capitalize">{request.profiles?.user_type}</TableCell>
              <TableCell>{request.reason || "No reason provided"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.status === "approved"
                      ? "destructive"
                      : request.status === "rejected"
                      ? "secondary"
                      : "default"
                  }
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>
                {request.status === "pending" && (
                  <div className="space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        updateStatus.mutate({
                          id: request.id,
                          status: "approved",
                        })
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateStatus.mutate({
                          id: request.id,
                          status: "rejected",
                        })
                      }
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeletionRequestsTable;
