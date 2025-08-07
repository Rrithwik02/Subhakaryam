
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Eye, Check, X } from "lucide-react";
import { ExtendedServiceRequest } from "@/integrations/supabase/types/requests";

const ServiceRequestsTable = () => {
  const [requests, setRequests] = useState<ExtendedServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ExtendedServiceRequest | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Join with profiles to get user information
      const { data: requestsData, error } = await supabase
        .from("service_requests")
        .select(`
          *,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Format the data to include user information
      const formattedData = requestsData?.map(request => ({
        ...request,
        city: "",  // Default empty value since it doesn't exist in the database
        preferred_date: null,  // Default null value
        preferred_time: null,  // Default null value
        budget_range: null,    // Default null value
        user_email: request.profiles?.email,
        user_name: request.profiles?.full_name || "Unknown User",
      })) as ExtendedServiceRequest[];

      setRequests(formattedData || []);
    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load service requests",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("service_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, status } : request
        )
      );

      toast({
        title: "Status Updated",
        description: `Request marked as ${status}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update request status",
      });
    }
  };

  const formatServiceType = (type: string) => {
    return type.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const formatBudgetRange = (range: string) => {
    if (!range) return "Not specified";
    
    const rangeMappings: {[key: string]: string} = {
      "under_5000": "Under ₹5,000",
      "5000_10000": "₹5,000 - ₹10,000",
      "10000_25000": "₹10,000 - ₹25,000",
      "25000_50000": "₹25,000 - ₹50,000",
      "above_50000": "Above ₹50,000"
    };
    
    return rangeMappings[range] || range;
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-ceremonial-maroon mb-6">
        Service Requests
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : requests.length > 0 ? (
        <Table>
          <TableCaption>A list of all service requests</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.user_name}</TableCell>
                <TableCell>{formatServiceType(request.service_type)}</TableCell>
                <TableCell>{request.city && request.city.charAt(0).toUpperCase() + request.city.slice(1)}</TableCell>
                <TableCell>
                  {format(new Date(request.created_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      request.status === "completed" ? "default" : 
                      request.status === "rejected" ? "destructive" : 
                      request.status === "in_progress" ? "secondary" :
                      "outline"
                    }
                  >
                    {request.status?.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Service Request Details</DialogTitle>
                        </DialogHeader>
                        {selectedRequest && (
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500">Client</p>
                              <p className="font-medium">{selectedRequest.user_name}</p>
                              <p className="text-sm">{selectedRequest.user_email}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Service Type</p>
                                <p className="font-medium">{formatServiceType(selectedRequest.service_type)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">City</p>
                                <p className="font-medium">
                                  {selectedRequest.city && 
                                    selectedRequest.city.charAt(0).toUpperCase() + selectedRequest.city.slice(1)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Preferred Date</p>
                                <p className="font-medium">
                                  {selectedRequest.preferred_date 
                                    ? format(new Date(selectedRequest.preferred_date), "MMM dd, yyyy") 
                                    : "Not specified"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Preferred Time</p>
                                <p className="font-medium">
                                  {selectedRequest.preferred_time || "Not specified"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Budget Range</p>
                                <p className="font-medium">
                                  {formatBudgetRange(selectedRequest.budget_range || '')}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <Badge 
                                  variant={
                                    selectedRequest.status === "completed" ? "default" : 
                                    selectedRequest.status === "rejected" ? "destructive" : 
                                    selectedRequest.status === "in_progress" ? "secondary" :
                                    "outline"
                                  }
                                >
                                  {selectedRequest.status?.replace("_", " ")}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Description</p>
                              <p className="whitespace-pre-wrap">{selectedRequest.description}</p>
                            </div>
                            <div className="pt-4 flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                onClick={() => updateStatus(selectedRequest.id, "rejected")}
                              >
                                <X className="h-4 w-4 mr-2" /> Reject
                              </Button>
                              <Button 
                                variant="secondary"
                                onClick={() => updateStatus(selectedRequest.id, "in_progress")}
                                className="bg-ceremonial-gold/20 hover:bg-ceremonial-gold/30 text-ceremonial-maroon"
                              >
                                In Progress
                              </Button>
                              <Button 
                                onClick={() => updateStatus(selectedRequest.id, "completed")}
                              >
                                <Check className="h-4 w-4 mr-2" /> Complete
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => updateStatus(request.id, "in_progress")}
                      className="bg-ceremonial-gold/20 hover:bg-ceremonial-gold/30 text-ceremonial-maroon"
                    >
                      In Progress
                    </Button>
                    
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => updateStatus(request.id, "completed")}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => updateStatus(request.id, "rejected")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-12 text-gray-500">No service requests found</div>
      )}
    </div>
  );
};

export default ServiceRequestsTable;
