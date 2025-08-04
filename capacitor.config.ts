import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1d772fcca1644075bbeb3e31686d5eab',
  appName: 'subhakaryam',
  webDir: 'dist',
  server: {
    url: 'https://1d772fcc-a164-4075-bbeb-3e31686d5eab.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: true,
      spinnerColor: "#999999"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;