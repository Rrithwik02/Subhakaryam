import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export class MobileService {
  static async checkPermissions() {
    if (!Capacitor.isNativePlatform()) return { camera: 'granted', location: 'granted' };

    const cameraPermissions = await Camera.checkPermissions();
    const locationPermissions = await Geolocation.checkPermissions();

    return {
      camera: cameraPermissions.camera,
      location: locationPermissions.location
    };
  }

  static async takePicture(source: 'camera' | 'gallery' = 'camera') {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Camera not available on web platform');
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      });

      return image.dataUrl;
    } catch (error) {
      console.error('Error taking picture:', error);
      throw error;
    }
  }

  static async getCurrentLocation() {
    if (!Capacitor.isNativePlatform()) {
      return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }),
          reject
        );
      });
    }

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  static async triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'medium') {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const impactStyle = style === 'light' ? ImpactStyle.Light :
                         style === 'heavy' ? ImpactStyle.Heavy : ImpactStyle.Medium;
      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.error('Error triggering haptic:', error);
    }
  }

  static async share(options: { title?: string; text?: string; url?: string }) {
    try {
      await Share.share(options);
    } catch (error) {
      console.error('Error sharing:', error);
      throw error;
    }
  }

  static async getNetworkStatus() {
    try {
      const status = await Network.getStatus();
      return status;
    } catch (error) {
      console.error('Error getting network status:', error);
      return { connected: true, connectionType: 'unknown' };
    }
  }

  static async getDeviceInfo() {
    try {
      const info = await Device.getInfo();
      return info;
    } catch (error) {
      console.error('Error getting device info:', error);
      return null;
    }
  }

  static async setStatusBarStyle(style: 'light' | 'dark' = 'dark') {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await StatusBar.setStyle({
        style: style === 'light' ? Style.Light : Style.Dark
      });
    } catch (error) {
      console.error('Error setting status bar style:', error);
    }
  }

  static async hideStatusBar() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await StatusBar.hide();
    } catch (error) {
      console.error('Error hiding status bar:', error);
    }
  }

  static async showStatusBar() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await StatusBar.show();
    } catch (error) {
      console.error('Error showing status bar:', error);
    }
  }
}