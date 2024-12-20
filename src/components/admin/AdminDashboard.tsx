import { Settings } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ServiceProvidersTable from "./ServiceProvidersTable";
import UsersTable from "./UsersTable";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Settings className="h-8 w-8 text-ceremonial-gold" />
          <h2 className="text-3xl font-display font-bold text-ceremonial-maroon">
            Admin Dashboard
          </h2>
        </div>
        
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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;