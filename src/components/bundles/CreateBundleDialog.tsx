import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

interface BundleItem {
  service_type: string;
  service_name: string;
  description: string;
  quantity: number;
  individual_price: number;
}

interface CreateBundleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateBundleDialog = ({ open, onOpenChange }: CreateBundleDialogProps) => {
  const [bundleName, setBundleName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [durationDays, setDurationDays] = useState('1');
  const [termsConditions, setTermsConditions] = useState('');
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([
    {
      service_type: '',
      service_name: '',
      description: '',
      quantity: 1,
      individual_price: 0,
    },
  ]);

  const queryClient = useQueryClient();

  // Get provider ID
  const { data: provider } = useQuery({
    queryKey: ['current-provider'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select('id')
        .single();

      if (error) throw error;
      return data;
    },
  });

  const createBundleMutation = useMutation({
    mutationFn: async () => {
      if (!provider?.id) throw new Error('Provider not found');

      // Create bundle
      const { data: bundle, error: bundleError } = await supabase
        .from('service_bundles')
        .insert({
          provider_id: provider.id,
          bundle_name: bundleName,
          description,
          base_price: parseFloat(basePrice),
          discounted_price: parseFloat(discountedPrice),
          max_guests: maxGuests ? parseInt(maxGuests) : null,
          duration_days: parseInt(durationDays),
          terms_conditions: termsConditions,
        })
        .select()
        .single();

      if (bundleError) throw bundleError;

      // Create bundle items
      const itemsToInsert = bundleItems
        .filter(item => item.service_name.trim())
        .map(item => ({
          bundle_id: bundle.id,
          service_type: item.service_type,
          service_name: item.service_name,
          description: item.description,
          quantity: item.quantity,
          individual_price: item.individual_price,
        }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('bundle_items')
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      return bundle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-bundles'] });
      toast.success('Bundle created successfully');
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to create bundle');
      console.error('Create bundle error:', error);
    },
  });

  const resetForm = () => {
    setBundleName('');
    setDescription('');
    setBasePrice('');
    setDiscountedPrice('');
    setMaxGuests('');
    setDurationDays('1');
    setTermsConditions('');
    setBundleItems([{
      service_type: '',
      service_name: '',
      description: '',
      quantity: 1,
      individual_price: 0,
    }]);
  };

  const addBundleItem = () => {
    setBundleItems([...bundleItems, {
      service_type: '',
      service_name: '',
      description: '',
      quantity: 1,
      individual_price: 0,
    }]);
  };

  const removeBundleItem = (index: number) => {
    setBundleItems(bundleItems.filter((_, i) => i !== index));
  };

  const updateBundleItem = (index: number, field: keyof BundleItem, value: any) => {
    const updated = bundleItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setBundleItems(updated);
  };

  const calculateDiscount = () => {
    const base = parseFloat(basePrice) || 0;
    const discounted = parseFloat(discountedPrice) || 0;
    if (base > 0) {
      return Math.round(((base - discounted) / base) * 100);
    }
    return 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Service Bundle</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bundleName">Bundle Name *</Label>
              <Input
                id="bundleName"
                value={bundleName}
                onChange={(e) => setBundleName(e.target.value)}
                placeholder="e.g., Complete Wedding Package"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationDays">Duration (Days)</Label>
              <Input
                id="durationDays"
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's included in this bundle..."
              rows={3}
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Individual Total Price *</Label>
              <Input
                id="basePrice"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountedPrice">Bundle Price *</Label>
              <Input
                id="discountedPrice"
                type="number"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Discount</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center">
                {calculateDiscount()}% off
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxGuests">Maximum Guests (Optional)</Label>
            <Input
              id="maxGuests"
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              placeholder="e.g., 200"
              min="1"
            />
          </div>

          {/* Bundle Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Services Included</Label>
              <Button type="button" variant="outline" size="sm" onClick={addBundleItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>

            {bundleItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Service Type</Label>
                      <Input
                        value={item.service_type}
                        onChange={(e) => updateBundleItem(index, 'service_type', e.target.value)}
                        placeholder="e.g., Photography"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Service Name</Label>
                      <Input
                        value={item.service_name}
                        onChange={(e) => updateBundleItem(index, 'service_name', e.target.value)}
                        placeholder="e.g., Wedding Photography"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateBundleItem(index, 'quantity', parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateBundleItem(index, 'description', e.target.value)}
                        placeholder="Brief description of this service..."
                      />
                    </div>
                    <div className="space-y-2 flex items-end">
                      {bundleItems.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeBundleItem(index)}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-2">
            <Label htmlFor="termsConditions">Terms & Conditions</Label>
            <Textarea
              id="termsConditions"
              value={termsConditions}
              onChange={(e) => setTermsConditions(e.target.value)}
              placeholder="Add any specific terms and conditions for this bundle..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createBundleMutation.mutate()}
              disabled={!bundleName || !basePrice || !discountedPrice || createBundleMutation.isPending}
            >
              {createBundleMutation.isPending ? 'Creating...' : 'Create Bundle'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};