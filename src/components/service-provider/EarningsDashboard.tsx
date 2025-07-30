import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, Calendar, Award } from 'lucide-react';
import { format } from 'date-fns';

interface EarningsData {
  commission_rate: number;
  tier: string;
  total_earnings: number;
  total_commission_paid: number;
}

interface PayoutData {
  id: string;
  amount: number;
  commission_amount: number;
  net_amount: number;
  status: string;
  payout_date: string;
  created_at: string;
}

const EarningsDashboard = () => {
  const { data: earnings } = useQuery({
    queryKey: ['provider-earnings'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Get provider ID first
      const { data: provider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('profile_id', user.user.id)
        .single();

      if (!provider) throw new Error('Provider not found');

      const { data, error } = await supabase
        .from('service_provider_commissions')
        .select('*')
        .eq('provider_id', provider.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as EarningsData | null;
    },
  });

  const { data: payouts } = useQuery({
    queryKey: ['provider-payouts'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Get provider ID first
      const { data: provider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('profile_id', user.user.id)
        .single();

      if (!provider) throw new Error('Provider not found');

      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('provider_id', provider.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as PayoutData[];
    },
  });

  const nextTierProgress = React.useMemo(() => {
    if (!earnings) return { tier: 'basic', progress: 0, nextTier: 'premium', required: 50000 };
    
    const totalEarnings = Number(earnings.total_earnings);
    
    if (earnings.tier === 'basic') {
      return {
        tier: 'basic',
        progress: Math.min((totalEarnings / 50000) * 100, 100),
        nextTier: 'premium',
        required: 50000 - totalEarnings,
      };
    } else if (earnings.tier === 'premium') {
      return {
        tier: 'premium',
        progress: Math.min(((totalEarnings - 50000) / 150000) * 100, 100),
        nextTier: 'vip',
        required: 200000 - totalEarnings,
      };
    } else {
      return {
        tier: 'vip',
        progress: 100,
        nextTier: null,
        required: 0,
      };
    }
  }, [earnings]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{earnings ? Number(earnings.total_earnings).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">After commission deduction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnings ? earnings.commission_rate : 15}%
            </div>
            <p className="text-xs text-muted-foreground">Platform commission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {earnings ? earnings.tier : 'Basic'}
            </div>
            <Badge variant={
              earnings?.tier === 'vip' ? 'default' :
              earnings?.tier === 'premium' ? 'secondary' : 'outline'
            }>
              {earnings ? earnings.tier.toUpperCase() : 'BASIC'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Payouts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payouts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Last 10 transactions</p>
          </CardContent>
        </Card>
      </div>

      {nextTierProgress.nextTier && (
        <Card>
          <CardHeader>
            <CardTitle>Tier Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {nextTierProgress.nextTier.toUpperCase()}</span>
                <span>{Math.round(nextTierProgress.progress)}%</span>
              </div>
              <Progress value={nextTierProgress.progress} className="h-2" />
            </div>
            {nextTierProgress.required > 0 && (
              <p className="text-sm text-muted-foreground">
                ₹{nextTierProgress.required.toLocaleString()} more earnings needed to reach {nextTierProgress.nextTier} tier
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts?.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{format(new Date(payout.payout_date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>₹{Number(payout.amount).toLocaleString()}</TableCell>
                  <TableCell>₹{Number(payout.commission_amount).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">₹{Number(payout.net_amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      payout.status === 'completed' ? 'default' :
                      payout.status === 'failed' ? 'destructive' :
                      payout.status === 'processing' ? 'secondary' : 'outline'
                    }>
                      {payout.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!payouts?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No payouts yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsDashboard;