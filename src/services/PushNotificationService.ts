import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

class PushNotificationService {
  private initialized = false;

  async initialize() {
    if (!Capacitor.isNativePlatform() || this.initialized) {
      console.log('Push notifications: Skipping initialization (not native platform or already initialized)');
      return;
    }

    try {
      // Check if push notifications are available
      const permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        const requestResult = await PushNotifications.requestPermissions();
        if (requestResult.receive !== 'granted') {
          console.warn('Push notifications: Permission denied by user');
          return;
        }
      } else if (permStatus.receive !== 'granted') {
        console.warn('Push notifications: Permission not granted');
        return;
      }

      // Attempt to register for push notifications with Firebase fallback
      try {
        await PushNotifications.register();
        console.log('Push notifications: Registration successful');
      } catch (registerError: any) {
        // Handle Firebase not initialized error gracefully
        if (registerError.message?.includes('FirebaseApp is not initialized')) {
          console.warn('Push notifications: Firebase not configured, disabling push notifications');
          return;
        }
        throw registerError;
      }

      // Set up listeners only after successful registration
      PushNotifications.addListener('registration', async (token) => {
        console.log('Push registration success, token: ' + token.value);
        await this.savePushToken(token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.warn('Push registration error (will continue without push notifications):', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification);
        this.handleForegroundNotification(notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed: ', notification);
        this.handleNotificationTap(notification);
      });

      this.initialized = true;
      console.log('Push notifications: Initialization complete');
    } catch (error) {
      console.warn('Push notifications: Failed to initialize, continuing without push notifications:', error);
      // Don't throw error, continue app initialization
    }
  }

  private async savePushToken(token: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Using upsert to handle both insert and update cases
        await supabase
          .from('profiles')
          .upsert({ 
            id: user.id,
            push_token: token 
          }, {
            onConflict: 'id'
          });
      }
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }

  private handleForegroundNotification(notification: any) {
    // Show custom in-app notification or toast
    console.log('Foreground notification:', notification);
  }

  private handleNotificationTap(notification: any) {
    const data = notification.notification.data;
    
    // Handle deep linking based on notification data
    if (data?.type === 'booking_update') {
      window.location.href = '/profile?tab=bookings';
    } else if (data?.type === 'chat_message') {
      window.location.href = '/profile?tab=messages';
    } else if (data?.type === 'payment_request') {
      window.location.href = '/profile?tab=payments';
    }
  }

  async unregister() {
    if (Capacitor.isNativePlatform()) {
      await PushNotifications.removeAllListeners();
    }
  }
}

export const pushNotificationService = new PushNotificationService();