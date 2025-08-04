import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobileFeatures } from '@/hooks/use-mobile-features';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
  onLocationSelect: (location: { latitude: number; longitude: number; address?: string }) => void;
  className?: string;
}

export function LocationPicker({ onLocationSelect, className }: LocationPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { getCurrentLocation, triggerHaptic } = useMobileFeatures();
  const { toast } = useToast();

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    try {
      triggerHaptic('medium');
      const location = await getCurrentLocation();
      
      // Reverse geocode to get address (simplified for demo)
      const address = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
      
      onLocationSelect({
        ...location,
        address
      });
      
      toast({
        title: "Location found!",
        description: "Your current location has been detected.",
      });
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "Location Error",
        description: "Failed to get your location. Please enable location services.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGetCurrentLocation}
      disabled={isLoading}
      variant="outline"
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4 mr-2" />
      )}
      {isLoading ? 'Getting Location...' : 'Use Current Location'}
    </Button>
  );
}