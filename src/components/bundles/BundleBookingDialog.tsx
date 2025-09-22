import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, Package, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface BundleBookingDialogProps {
  bundle: any;
  provider: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BundleBookingDialog = ({ bundle, provider, open, onOpenChange }: BundleBookingDialogProps) => {
  const [eventDate, setEventDate] = useState<Date>();
  const [guestCount, setGuestCount] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const queryClient = useQueryClient();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateAdvanceAmount = () => {
    const percentage = bundle.min_advance_percentage || 30;
    return (bundle.discounted_price * percentage) / 100;
  };

  const bookBundleMutation = useMutation({
    mutationFn: async () => {
      if (!eventDate) throw new Error('Please select an event date');

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Please login to book');

      const advanceAmount = calculateAdvanceAmount();

      const { error } = await supabase
        .from('bundle_bookings')
        .insert({
          user_id: user.user.id,
          bundle_id: bundle.id,
          event_date: format(eventDate, 'yyyy-MM-dd'),
          guest_count: guestCount ? parseInt(guestCount) : null,
          total_amount: bundle.discounted_price,
          advance_amount: advanceAmount,
          special_requirements: specialRequirements,
          status: 'pending',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      toast.success('Bundle booking request submitted successfully!');
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to submit booking request');
      console.error('Bundle booking error:', error);
    },
  });

  const resetForm = () => {
    setEventDate(undefined);
    setGuestCount('');
    setSpecialRequirements('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Bundle: {bundle.bundle_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bundle Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{bundle.bundle_name}</h3>
                <p className="text-sm text-muted-foreground">{provider.business_name}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  {formatPrice(bundle.discounted_price)}
                </div>
                {bundle.base_price !== bundle.discounted_price && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatPrice(bundle.base_price)}
                  </div>
                )}
              </div>
            </div>

            {/* Bundle Features */}
            <div className="flex flex-wrap gap-2">
              {bundle.max_guests && (
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  Up to {bundle.max_guests} guests
                </Badge>
              )}
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {bundle.duration_days} day{bundle.duration_days > 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Package className="h-3 w-3" />
                {bundle.bundle_items?.length || 0} services
              </Badge>
            </div>

            {/* Services Preview */}
            {bundle.bundle_items && bundle.bundle_items.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Included Services:</p>
                <div className="text-sm text-muted-foreground">
                  {bundle.bundle_items.slice(0, 3).map((item: any, index: number) => (
                    <span key={index}>
                      {item.service_name}
                      {index < Math.min(bundle.bundle_items.length, 3) - 1 ? ', ' : ''}
                    </span>
                  ))}
                  {bundle.bundle_items.length > 3 && (
                    <span> and {bundle.bundle_items.length - 3} more...</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Event Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, 'PPP') : 'Select event date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestCount">Expected Guest Count</Label>
              <Input
                id="guestCount"
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="Enter number of guests"
                min="1"
                max={bundle.max_guests || undefined}
              />
              {bundle.max_guests && (
                <p className="text-xs text-muted-foreground">
                  Maximum allowed: {bundle.max_guests} guests
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="Any special requirements or customizations..."
                rows={4}
              />
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-primary/5 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold">Payment Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Bundle Total:</span>
                <span>{formatPrice(bundle.discounted_price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Advance Payment ({bundle.min_advance_percentage || 30}%):</span>
                <span className="font-medium text-primary">
                  {formatPrice(calculateAdvanceAmount())}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Remaining Payment:</span>
                <span>{formatPrice(bundle.discounted_price - calculateAdvanceAmount())}</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          {bundle.terms_conditions && (
            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
              <strong>Terms & Conditions:</strong> {bundle.terms_conditions}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => bookBundleMutation.mutate()}
              disabled={!eventDate || bookBundleMutation.isPending}
            >
              {bookBundleMutation.isPending ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};