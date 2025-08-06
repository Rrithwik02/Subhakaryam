import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PortfolioImageViewer } from "./PortfolioImageViewer";
import { MobileOptimizedDialogContent } from "@/components/ui/mobile-optimized-dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface AdditionalServiceReviewDialogProps {
  service: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (params: { serviceId: string; status: string; adminNotes?: string }) => void;
  isUpdating: boolean;
}

export function AdditionalServiceReviewDialog({ 
  service, 
  isOpen, 
  onClose, 
  onUpdateStatus, 
  isUpdating 
}: AdditionalServiceReviewDialogProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleApprove = () => {
    onUpdateStatus({ 
      serviceId: service.id, 
      status: "approved",
      adminNotes: adminNotes || undefined
    });
  };

  const handleReject = () => {
    onUpdateStatus({ 
      serviceId: service.id, 
      status: "rejected",
      adminNotes: adminNotes
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending Review</Badge>;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <MobileOptimizedDialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Service Review: {service.service_type}
              {getStatusBadge(service.status)}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1">
              <div className="space-y-6 p-1">
                {/* Service Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Service Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Service Type</Label>
                      <p className="text-sm">{service.service_type}</p>
                    </div>
                    {service.subcategory && (
                      <div>
                        <Label className="text-sm font-medium">Subcategory</Label>
                        <p className="text-sm">{service.subcategory}</p>
                      </div>
                    )}
                    {service.specialization && (
                      <div>
                        <Label className="text-sm font-medium">Specialization</Label>
                        <p className="text-sm">{service.specialization}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium">Price Range</Label>
                      <p className="text-sm">₹{service.min_price} - ₹{service.max_price}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">{service.description}</p>
                  </div>
                </div>

                <Separator />

                {/* Provider Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Service Provider</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Business Name</Label>
                      <p className="text-sm">{service.service_providers.business_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Contact Person</Label>
                      <p className="text-sm">{service.service_providers.profiles.full_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{service.service_providers.profiles.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Submitted</Label>
                      <p className="text-sm">{new Date(service.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Portfolio Images */}
                {service.portfolio_images && service.portfolio_images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Portfolio Images ({service.portfolio_images.length})</h3>
                    <PortfolioImageViewer images={service.portfolio_images} />
                  </div>
                )}

                <Separator />

                {/* Admin Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Admin Notes</h3>
                  <div>
                    <Label htmlFor="admin-notes">Add notes or rejection reason</Label>
                    <Textarea
                      id="admin-notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Enter any notes about this service review..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            {service.status === "pending" && (
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button
                  onClick={() => setShowRejectDialog(true)}
                  variant="destructive"
                  disabled={isUpdating}
                  className="flex-1"
                >
                  Reject Service
                </Button>
                <Button
                  onClick={() => setShowApproveDialog(true)}
                  disabled={isUpdating}
                  className="flex-1"
                >
                  Approve Service
                </Button>
              </div>
            )}
          </div>
        </MobileOptimizedDialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this additional service? It will become visible to customers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={isUpdating}>
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this additional service? 
              {!adminNotes && " Please consider adding a note explaining the reason."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject} 
              disabled={isUpdating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}