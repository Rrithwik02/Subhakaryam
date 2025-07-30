import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Users, AlertTriangle } from 'lucide-react';

interface CommissionData {
  id: string;
  provider_id: string;
  commission_rate: number;
  tier: string;
  total_earnings: number;
  total_commission_paid: number;
  created_at: string;
  service_providers: {
    business_name: string;
    profiles: {
      full_name: string;
    };
  };
}

const CommissionDashboard = () => {
  const { data: commissions, isLoading } = useQuery({
    queryKey: ['admin-commissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_commissions')
        .select(`
          *,
          service_providers!inner(
            business_name,
            profiles!inner(full_name)
          )
        `)
        .order('total_earnings', { ascending: false });

      if (error) throw error;
      return data as CommissionData[];
    },
  });

  const totalCommissions = commissions?.reduce((sum, c) => sum + Number(c.total_commission_paid), 0) || 0;
  const totalEarnings = commissions?.reduce((sum, c) => sum + Number(c.total_earnings), 0) || 0;
  const averageRate = commissions?.reduce((sum, c) => sum + c.commission_rate, 0) / (commissions?.length || 1) || 0;

  if (isLoading) {
    return <div className="p-6">Loading commission data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCommissions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Provider Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commissions?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Total Earnings</TableHead>
                <TableHead>Commission Paid</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions?.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{commission.service_providers.business_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {commission.service_providers.profiles.full_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      commission.tier === 'vip' ? 'default' :
                      commission.tier === 'premium' ? 'secondary' : 'outline'
                    }>
                      {commission.tier.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{commission.commission_rate}%</TableCell>
                  <TableCell>₹{Number(commission.total_earnings).toLocaleString()}</TableCell>
                  <TableCell>₹{Number(commission.total_commission_paid).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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

export default CommissionDashboard;