import { useState, useEffect } from 'react';
import { MobileService } from '@/services/MobileService';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

export function useMobileFeatures() {
  const [isNative, setIsNative] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<any>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    
    const initializeMobileFeatures = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const status = await MobileService.getNetworkStatus();
          setNetworkStatus(status);
          
          const info = await MobileService.getDeviceInfo();
          setDeviceInfo(info);
        } catch (error) {
          console.error('Error initializing mobile features:', error);
        }
      }
    };

    initializeMobileFeatures();
  }, []);

  const takePicture = async (source: 'camera' | 'gallery' = 'camera') => {
    try {
      const imageData = await MobileService.takePicture(source);
      return imageData;
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Failed to take picture. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await MobileService.getCurrentLocation();
      return location;
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Failed to get your location. Please enable location services.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    MobileService.triggerHaptic(style);
  };

  const shareContent = async (options: { title?: string; text?: string; url?: string }) => {
    try {
      await MobileService.share(options);
    } catch (error) {
      toast({
        title: "Share Error",
        description: "Failed to share content.",
        variant: "destructive",
      });
    }
  };

  return {
    isNative,
    networkStatus,
    deviceInfo,
    takePicture,
    getCurrentLocation,
    triggerHaptic,
    shareContent,
  };
}