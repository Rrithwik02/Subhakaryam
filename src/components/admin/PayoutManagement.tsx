import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface PayoutData {
  id: string;
  provider_id: string;
  amount: number;
  commission_amount: number;
  net_amount: number;
  payout_method: string;
  status: string;
  payout_date: string;
  created_at: string;
  service_providers: {
    business_name: string;
    profiles: {
      full_name: string;
    };
    provider_payment_details: Array<{
      id: string;
      payment_method: "bank_account" | "upi" | "qr_code";
      account_holder_name: string;
      bank_name: string;
      account_number: string;
      upi_id: string;
      qr_code_url: string;
      ifsc_code: string;
      created_at: string;
      updated_at: string;
      provider_id: string;
    }>;
  };
}

const PayoutManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payouts, isLoading } = useQuery({
    queryKey: ['admin-payouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payouts')
        .select(`
          *,
          service_providers!inner(
            business_name,
            profiles!inner(full_name),
            provider_payment_details(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as PayoutData[];
    },
  });

  const updatePayoutStatus = useMutation({
    mutationFn: async ({ payoutId, status }: { payoutId: string; status: string }) => {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.processed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('payouts')
        .update(updateData)
        .eq('id', payoutId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      toast({
        title: "Success",
        description: "Payout status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update payout status",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading payout data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payout Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Net Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts?.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payout.service_providers.business_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {payout.service_providers.profiles.full_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>₹{Number(payout.amount).toLocaleString()}</TableCell>
                  <TableCell>₹{Number(payout.commission_amount).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">₹{Number(payout.net_amount).toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{payout.payout_method.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(payout.status)} className="flex items-center gap-1">
                      {getStatusIcon(payout.status)}
                      {payout.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(payout.payout_date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {payout.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updatePayoutStatus.mutate({ 
                              payoutId: payout.id, 
                              status: 'processing' 
                            })}
                          >
                            Process
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updatePayoutStatus.mutate({ 
                              payoutId: payout.id, 
                              status: 'failed' 
                            })}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {payout.status === 'processing' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => updatePayoutStatus.mutate({ 
                            payoutId: payout.id, 
                            status: 'completed' 
                          })}
                        >
                          Complete
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Payout Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">Provider Information</h4>
                              <p>{payout.service_providers.business_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {payout.service_providers.profiles.full_name}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium">Payment Details</h4>
                              {payout.service_providers.provider_payment_details.map((detail, index) => (
                                <div key={index} className="text-sm space-y-1">
                                  <p>Method: {detail.payment_method}</p>
                                  {detail.account_holder_name && <p>Name: {detail.account_holder_name}</p>}
                                  {detail.bank_name && <p>Bank: {detail.bank_name}</p>}
                                  {detail.account_number && <p>Account: {detail.account_number.replace(/\d(?=\d{4})/g, '*')}</p>}
                                  {detail.upi_id && <p>UPI: {detail.upi_id}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutManagement;