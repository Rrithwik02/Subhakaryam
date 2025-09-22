import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { CreateBundleDialog } from './CreateBundleDialog';
import { BundleCard } from './BundleCard';

export const BundleManagement = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const queryClient = useQueryClient();

  // Fetch provider bundles
  const { data: bundles, isLoading } = useQuery({
    queryKey: ['provider-bundles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_bundles')
        .select(`
          *,
          bundle_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Delete bundle mutation
  const deleteBundleMutation = useMutation({
    mutationFn: async (bundleId: string) => {
      const { error } = await supabase
        .from('service_bundles')
        .delete()
        .eq('id', bundleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-bundles'] });
      toast.success('Bundle deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete bundle');
      console.error('Delete bundle error:', error);
    },
  });

  // Toggle bundle status
  const toggleBundleStatus = useMutation({
    mutationFn: async ({ bundleId, isActive }: { bundleId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('service_bundles')
        .update({ is_active: !isActive })
        .eq('id', bundleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-bundles'] });
      toast.success('Bundle status updated');
    },
    onError: (error) => {
      toast.error('Failed to update bundle status');
      console.error('Toggle bundle status error:', error);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Bundles</h2>
          <p className="text-muted-foreground">
            Create and manage service packages for better value and convenience
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Bundle
        </Button>
      </div>

      {bundles && bundles.length > 0 ? (
        <div className="grid gap-6">
          {bundles.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onDelete={(id) => deleteBundleMutation.mutate(id)}
              onToggleStatus={(id, isActive) => 
                toggleBundleStatus.mutate({ bundleId: id, isActive })
              }
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bundles created yet</h3>
            <p className="text-muted-foreground mb-4">
              Start creating service bundles to offer better value to your customers
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              Create Your First Bundle
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateBundleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};