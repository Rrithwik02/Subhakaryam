import { useQuery } from "@tanstack/react-query";
import { Settings, Users, Calendar, IndianRupee, BellDot } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceProvidersTable from "./ServiceProvidersTable";
import UsersTable from "./UsersTable";
import ReviewsTable from "./ReviewsTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      type CountResponse = {
        count: number | null;
      };

      const [
        { data: totalServicesData },
        { data: serviceProvidersData },
        { data: activeBookingsData },
        { data: payments },
        { data: pendingApprovalsData }
      ] = await Promise.all([
        supabase.from('service_providers').select('*', { count: 'exact', head: true }),
        supabase.from('service_providers').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
        supabase.from('payments').select('amount'),
        supabase.from('service_providers').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      const totalRevenue = payments?.reduce((sum, payment) => 
        sum + (payment.amount || 0), 0) || 0;

      return {
        totalServices: (totalServicesData as CountResponse)?.count || 0,
        serviceProviders: (serviceProvidersData as CountResponse)?.count || 0,
        activeBookings: (activeBookingsData as CountResponse)?.count || 0,
        totalRevenue,
        pendingApprovals: (pendingApprovalsData as CountResponse)?.count || 0
      };
    },
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!session?.user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;
        
        if (data?.user_type !== 'admin') {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have admin privileges.",
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [session, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Settings className="h-8 w-8 text-ceremonial-gold" />
          <h2 className="text-3xl font-display font-bold text-ceremonial-maroon">
            Admin Dashboard
          </h2>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalServices || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.serviceProviders || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeBookings || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats?.totalRevenue || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Pending Service Approvals</CardTitle>
            <BellDot className="h-4 w-4 text-ceremonial-gold" />
          </CardHeader>
          <CardContent>
            {stats?.pendingApprovals ? (
              <div className="text-lg">{stats.pendingApprovals} pending approval(s)</div>
            ) : (
              <div className="text-lg text-muted-foreground">No pending approvals</div>
            )}
          </CardContent>
        </Card>
        
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-lg border">
            <TabsTrigger 
              value="services"
              className="data-[state=active]:bg-ceremonial-gold data-[state=active]:text-white"
            >
              Service Providers
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-ceremonial-gold data-[state=active]:text-white"
            >
              User Management
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:bg-ceremonial-gold data-[state=active]:text-white"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            <h3 className="text-xl font-semibold text-ceremonial-maroon">
              Service Providers Management
            </h3>
            <ServiceProvidersTable />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <h3 className="text-xl font-semibold text-ceremonial-maroon">
              User Management
            </h3>
            <UsersTable />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <h3 className="text-xl font-semibold text-ceremonial-maroon">
              Review Management
            </h3>
            <ReviewsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;