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
import { UserPlus, UserMinus } from "lucide-react";

const UsersTable = () => {
  const { toast } = useToast();

  const { 
    data: users, 
    isLoading: isLoadingUsers,
    refetch: refetchUsers 
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch users",
        });
        return [];
      }
      return data;
    },
  });

  const updateUserType = async (userId: string, newType: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ user_type: newType })
      .eq("id", userId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user type",
      });
      return;
    }

    toast({
      title: "Success",
      description: "User type updated successfully",
    });
    refetchUsers();
  };

  if (isLoadingUsers) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.user_type}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateUserType(user.id, 'admin')}
                    className="flex items-center gap-1 hover:bg-ceremonial-gold hover:text-white transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Make Admin
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateUserType(user.id, 'guest')}
                    className="flex items-center gap-1 hover:bg-ceremonial-maroon hover:text-white transition-colors"
                  >
                    <UserMinus className="h-4 w-4" />
                    Remove Admin
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;