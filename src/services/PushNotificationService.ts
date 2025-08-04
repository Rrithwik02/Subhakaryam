import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

class PushNotificationService {
  private initialized = false;

  async initialize() {
    if (!Capacitor.isNativePlatform() || this.initialized) {
      return;
    }

    try {
      // Request permission
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
      
      if (permStatus.receive !== 'granted') {
        throw new Error('User denied push notification permissions');
      }

      // Register for push notifications
      await PushNotifications.register();

      // Set up listeners
      PushNotifications.addListener('registration', async (token) => {
        console.log('Push registration success, token: ' + token.value);
        await this.savePushToken(token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error: ', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification);
        // Handle notification when app is in foreground
        this.handleForegroundNotification(notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed: ', notification);
        // Handle notification tap
        this.handleNotificationTap(notification);
      });

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
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