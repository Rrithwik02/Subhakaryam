import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceProvidersTable from "./ServiceProvidersTable";
import UsersTable from "./UsersTable";
import ReviewsTable from "./ReviewsTable";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-ceremonial-maroon">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage service providers, users, and reviews
          </p>
        </div>

        <Tabs defaultValue="providers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="providers">Service Providers</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="bg-white rounded-lg shadow-lg p-6">
            <ServiceProvidersTable />
          </TabsContent>

          <TabsContent value="users" className="bg-white rounded-lg shadow-lg p-6">
            <UsersTable />
          </TabsContent>

          <TabsContent value="reviews" className="bg-white rounded-lg shadow-lg p-6">
            <ReviewsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;