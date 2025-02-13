
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
import { format } from "date-fns";
import { CheckCircle2, XCircle, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type PaymentWithDetails = {
  id: string;
  amount: number;
  payment_type: 'advance' | 'final';
  status: 'pending' | 'completed' | 'failed';
  admin_verified: boolean;
  created_at: string;
  bookings: {
    profiles: {
      full_name: string;
      phone: string;
    };
    service_providers: {
      business_name: string;
      profiles: {
        phone: string;
      };
    };
  };
};

const PaymentsTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null);

  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          bookings (
            profiles (
              full_name,
              phone
            ),
            service_providers (
              business_name,
              profiles (
                phone
              )
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PaymentWithDetails[];
    },
  });

  const verifyPayment = useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase
        .from("payments")
        .update({ admin_verified: true })
        .eq("id", paymentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast({
        title: "Success",
        description: "Payment has been verified",
      });
      setSelectedPayment(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify payment",
      });
      console.error("Verify payment error:", error);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Payments</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service Provider</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                {format(new Date(payment.created_at), "PPp")}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">
                    {payment.bookings?.profiles?.full_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {payment.bookings?.profiles?.phone}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">
                    {payment.bookings?.service_providers?.business_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {payment.bookings?.service_providers?.profiles?.phone}
                  </p>
                </div>
              </TableCell>
              <TableCell>₹{payment.amount}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {payment.payment_type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    payment.status === "completed"
                      ? "secondary"
                      : payment.status === "failed"
                      ? "destructive"
                      : "default"
                  }
                  className="capitalize"
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>
                {payment.admin_verified ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </TableCell>
              <TableCell>
                <div className="space-x-2">
                  {!payment.admin_verified && payment.status === "completed" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      Verify Payment
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!selectedPayment}
        onOpenChange={() => setSelectedPayment(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <div className="space-y-2">
                <p>
                  Amount: <span className="font-medium">₹{selectedPayment?.amount}</span>
                </p>
                <p>
                  Type:{" "}
                  <span className="font-medium capitalize">
                    {selectedPayment?.payment_type} Payment
                  </span>
                </p>
                <p>
                  Status:{" "}
                  <span className="font-medium capitalize">
                    {selectedPayment?.status}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Service Provider Details</h3>
              <div className="space-y-2">
                <p>
                  Business:{" "}
                  <span className="font-medium">
                    {selectedPayment?.bookings?.service_providers?.business_name}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">
                    {selectedPayment?.bookings?.service_providers?.profiles?.phone}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedPayment(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => verifyPayment.mutate(selectedPayment?.id)}
              disabled={verifyPayment.isPending}
            >
              {verifyPayment.isPending ? "Verifying..." : "Verify Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsTable;
