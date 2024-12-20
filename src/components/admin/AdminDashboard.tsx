import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, UserPlus, UserMinus, Settings } from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();

  // Query for service providers
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

  // Query for users
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

  if (isLoadingServices || isLoadingUsers) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-ceremonial-gold" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-display font-bold text-ceremonial-maroon mb-6 flex items-center gap-2">
        <Settings className="h-8 w-8" />
        Admin Dashboard
      </h2>
      
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="services">Service Providers</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Service Providers Management</h3>
          <div className="overflow-x-auto">
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
        </TabsContent>

        <TabsContent value="users" className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">User Management</h3>
          <div className="overflow-x-auto">
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
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.user_type}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserType(user.id, 'admin')}
                          className="flex items-center gap-1"
                        >
                          <UserPlus className="h-4 w-4" />
                          Make Admin
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserType(user.id, 'guest')}
                          className="flex items-center gap-1"
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;