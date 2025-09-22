import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Package, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PublicBundleCardProps {
  bundle: any;
  provider: any;
}

export const PublicBundleCard = ({ bundle, provider }: PublicBundleCardProps) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBookBundle = () => {
    navigate(`/bundle-booking/${bundle.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{bundle.bundle_name}</CardTitle>
            {bundle.discount_percentage > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {bundle.discount_percentage}% OFF
              </Badge>
            )}
          </div>
          
          {/* Provider Info */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium">{provider.business_name}</span>
            </div>
            {provider.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{provider.rating}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{provider.city}</span>
            </div>
          </div>

          <p className="text-muted-foreground">{bundle.description}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pricing */}
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(bundle.discounted_price)}
          </div>
          {bundle.base_price !== bundle.discounted_price && (
            <div className="text-lg text-muted-foreground line-through">
              {formatPrice(bundle.base_price)}
            </div>
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

        {/* Included Services - Limited Preview */}
        {bundle.bundle_items && bundle.bundle_items.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">What's Included:</h4>
            <div className="space-y-1">
              {bundle.bundle_items.slice(0, 4).map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <span>{item.service_name}</span>
                  {item.quantity > 1 && (
                    <span className="text-muted-foreground">({item.quantity}x)</span>
                  )}
                </div>
              ))}
              {bundle.bundle_items.length > 4 && (
                <div className="text-sm text-muted-foreground pl-4">
                  +{bundle.bundle_items.length - 4} more services
                </div>
              )}
            </div>
          </div>
        )}

        {/* Advance Payment Info */}
        {bundle.min_advance_percentage && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
            Minimum advance: {bundle.min_advance_percentage}% of total amount
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleBookBundle}
            className="flex-1"
          >
            Book This Bundle
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(`/provider/${provider.id}?tab=bundles`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};