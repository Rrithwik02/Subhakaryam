
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceProvidersTable from "./ServiceProvidersTable";
import UsersTable from "./UsersTable";
import ReviewsTable from "./ReviewsTable";
import DeletionRequestsTable from "./DeletionRequestsTable";
import PaymentsTable from "./PaymentsTable";
import ContactSubmissionsTable from "./ContactSubmissionsTable";
import ServiceRequestsTable from "./ServiceRequestsTable";

import PayoutManagement from "./PayoutManagement";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminDashboard = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
      <div className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <h1 className={`${isMobile ? "text-2xl" : "text-4xl"} font-display font-bold text-ceremonial-maroon`}>
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage service providers, users, reviews, payments, service requests, and more
          </p>
        </div>

        <Tabs defaultValue="providers" className="space-y-6">
          <div className={`${isMobile ? "overflow-x-auto" : ""}`}>
            <TabsList className={`${isMobile ? "flex min-w-max" : "grid"} ${isMobile ? "" : "w-full grid-cols-7"} h-auto ${isMobile ? "p-1" : ""}`}>
              <TabsTrigger value="providers" className={`${isMobile ? "whitespace-nowrap px-3 py-2 text-xs" : ""}`}>
                {isMobile ? "Providers" : "Service Providers"}
              </TabsTrigger>
              <TabsTrigger value="users" className={`${isMobile ? "whitespace-nowrap px-3 py-2 text-xs" : ""}`}>
                Users
              </TabsTrigger>
              <TabsTrigger value="reviews" className={`${isMobile ? "whitespace-nowrap px-3 py-2 text-xs" : ""}`}>
                Reviews
              </TabsTrigger>
              <TabsTrigger value="payments" className={`${isMobile ? "whitespace-nowrap px-3 py-2 text-xs" : ""}`}>
                Payments
              </TabsTrigger>
              <TabsTrigger value="payouts" className={`${isMobile ? "whitespace-nowrap px-3 py-2 text-xs" : ""}`}>
                Payouts
              </TabsTrigger>
              <TabsTrigger value="deletion-requests" className={`${isMobile ? "whitespace-nowrap px-3 py-2 text-xs" : ""}`}>
                {isMobile ? "Deletions" : "Deletion Requests"}
              </TabsTrigger>
              <TabsTrigger value="contacts" className={`${isMobile ? "whitespace-nowrap px-3 py-2 text-xs" : ""}`}>
                {isMobile ? "Contacts" : "Contact Submissions"}
              </TabsTrigger>
              <TabsTrigger value="service-requests" className={`${isMobile ? "whitespace-nowrap px-3 py-2 text-xs" : ""}`}>
                {isMobile ? "Requests" : "Service Requests"}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="providers" className={`bg-white rounded-lg shadow-lg ${isMobile ? "p-2" : "p-6"}`}>
            {isMobile ? (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <ServiceProvidersTable />
              </ScrollArea>
            ) : (
              <ServiceProvidersTable />
            )}
          </TabsContent>

          <TabsContent value="users" className={`bg-white rounded-lg shadow-lg ${isMobile ? "p-2" : "p-6"}`}>
            {isMobile ? (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <UsersTable />
              </ScrollArea>
            ) : (
              <UsersTable />
            )}
          </TabsContent>

          <TabsContent value="reviews" className={`bg-white rounded-lg shadow-lg ${isMobile ? "p-2" : "p-6"}`}>
            {isMobile ? (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <ReviewsTable />
              </ScrollArea>
            ) : (
              <ReviewsTable />
            )}
          </TabsContent>

          <TabsContent value="payments" className={`bg-white rounded-lg shadow-lg ${isMobile ? "p-2" : "p-6"}`}>
            {isMobile ? (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <PaymentsTable />
              </ScrollArea>
            ) : (
              <PaymentsTable />
            )}
          </TabsContent>


          <TabsContent value="payouts" className={`bg-white rounded-lg shadow-lg ${isMobile ? "p-2" : "p-6"}`}>
            {isMobile ? (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <PayoutManagement />
              </ScrollArea>
            ) : (
              <PayoutManagement />
            )}
          </TabsContent>

          <TabsContent value="deletion-requests" className={`bg-white rounded-lg shadow-lg ${isMobile ? "p-2" : "p-6"}`}>
            {isMobile ? (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <DeletionRequestsTable />
              </ScrollArea>
            ) : (
              <DeletionRequestsTable />
            )}
          </TabsContent>

          <TabsContent value="contacts" className={`bg-white rounded-lg shadow-lg ${isMobile ? "p-2" : "p-6"}`}>
            {isMobile ? (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <ContactSubmissionsTable />
              </ScrollArea>
            ) : (
              <ContactSubmissionsTable />
            )}
          </TabsContent>

          <TabsContent value="service-requests" className={`bg-white rounded-lg shadow-lg ${isMobile ? "p-2" : "p-6"}`}>
            {isMobile ? (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <ServiceRequestsTable />
              </ScrollArea>
            ) : (
              <ServiceRequestsTable />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
