import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, EyeOff, Users, Calendar, Package } from 'lucide-react';

interface BundleCardProps {
  bundle: any;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export const BundleCard = ({ bundle, onDelete, onToggleStatus }: BundleCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className={`transition-all ${bundle.is_active ? 'border-primary/20' : 'border-muted bg-muted/30'}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{bundle.bundle_name}</CardTitle>
              <Badge variant={bundle.is_active ? 'default' : 'secondary'}>
                {bundle.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-muted-foreground">{bundle.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(bundle.id, bundle.is_active)}
            >
              {bundle.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(bundle.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pricing */}
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(bundle.discounted_price)}
          </div>
          {bundle.base_price !== bundle.discounted_price && (
            <>
              <div className="text-lg text-muted-foreground line-through">
                {formatPrice(bundle.base_price)}
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {bundle.discount_percentage}% OFF
              </Badge>
            </>
          )}
        </div>

        {/* Bundle Details */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {bundle.max_guests && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Up to {bundle.max_guests} guests
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {bundle.duration_days} day{bundle.duration_days > 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            {bundle.bundle_items?.length || 0} services included
          </div>
        </div>

        {/* Included Services */}
        {bundle.bundle_items && bundle.bundle_items.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Included Services:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {bundle.bundle_items.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <span className="font-medium">{item.service_name}</span>
                  {item.quantity > 1 && (
                    <span className="text-muted-foreground">({item.quantity}x)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        {bundle.terms_conditions && (
          <div className="space-y-2">
            <h4 className="font-semibold">Terms & Conditions:</h4>
            <p className="text-sm text-muted-foreground">
              {bundle.terms_conditions}
            </p>
          </div>
        )}

        {/* Advance Payment Info */}
        {bundle.min_advance_percentage && (
          <div className="text-sm text-muted-foreground">
            Minimum advance payment: {bundle.min_advance_percentage}%
          </div>
        )}
      </CardContent>
    </Card>
  );
};