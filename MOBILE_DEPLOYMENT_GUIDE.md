# 📱 Subhakaryam Mobile App Deployment Guide

## 🚀 Quick Start - Testing on Your Phone

### Prerequisites
- Node.js (v18 or higher)
- Git
- Android Studio (for Android) or Xcode (for iOS)

### Step 1: Export & Setup Local Development

1. **Export to GitHub** (from Lovable dashboard)
   - Click "Export to GitHub" button in Lovable
   - Create a new repository or select existing one

2. **Clone and Setup Locally**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   npm install
   ```

### Step 2: Add Mobile Platforms

```bash
# Add platforms (choose one or both)
npx cap add android    # For Android
npx cap add ios        # For iOS (Mac only)
```

### Step 3: Build and Sync

```bash
npm run build
npx cap sync
```

### Step 4: Run on Device/Emulator

```bash
# For Android
npx cap run android

# For iOS (Mac only)
npx cap run ios
```

---

## 📋 Production App Store Deployment

### 🤖 Google Play Store (Android)

#### Prerequisites
- Google Play Console account ($25 one-time fee)
- Signed APK/AAB file

#### Step 1: Generate Signing Key
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

#### Step 2: Configure Gradle Signing
Add to `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('../my-release-key.keystore')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'my-key-alias'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### Step 3: Build Release APK/AAB
```bash
cd android
./gradlew assembleRelease
# OR for AAB (recommended)
./gradlew bundleRelease
```

#### Step 4: Upload to Play Console
1. Create app in Google Play Console
2. Fill app information, screenshots, description
3. Upload APK/AAB file
4. Complete store listing
5. Submit for review

#### Required Assets for Play Store:
- **App Icon**: 512x512px PNG
- **Feature Graphic**: 1024x500px JPG/PNG
- **Screenshots**: 
  - Phone: 320-3840px width, 16:9 or 9:16 ratio
  - Tablet: 1200-3840px width, 16:10 or 10:16 ratio
- **High-res Icon**: 512x512px PNG

---

### 🍎 Apple App Store (iOS)

#### Prerequisites
- Apple Developer Account ($99/year)
- Mac with Xcode
- App Store Connect access

#### Step 1: Configure iOS Project
```bash
npx cap open ios
```

#### Step 2: Xcode Setup
1. Open project in Xcode
2. Select your Team in Signing & Capabilities
3. Configure Bundle Identifier (e.g., `com.yourcompany.subhakaryam`)
4. Set up provisioning profiles

#### Step 3: Build for Release
1. In Xcode: Product → Archive
2. Once archived, click "Distribute App"
3. Choose "App Store Connect"
4. Follow upload wizard

#### Step 4: App Store Connect Submission
1. Create app in App Store Connect
2. Fill metadata, screenshots, description
3. Submit for review

#### Required Assets for App Store:
- **App Icon**: Multiple sizes (20-1024px)
- **Screenshots**: 
  - iPhone: 1290x2796px, 1284x2778px, 828x1792px
  - iPad: 2048x2732px, 1668x2388px
- **App Preview Videos**: 15-30 seconds (optional)

---

## 🔧 Development Configuration

### Environment Variables (if needed)
Create `.env.local`:
```bash
# Supabase (already configured in code)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Additional services
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### Capacitor Configuration
The app is already configured with:
- **App ID**: `app.lovable.1d772fcca1644075bbeb3e31686d5eab`
- **App Name**: `subhakaryam`
- **Hot Reload**: Enabled for development

### Mobile Features Implemented:
✅ Camera & Gallery access  
✅ Geolocation services  
✅ Push notifications  
✅ Haptic feedback  
✅ Native sharing  
✅ Network status detection  
✅ Device information  
✅ Pull-to-refresh  
✅ Swipe gestures  
✅ Bottom navigation  
✅ Mobile-optimized UI  

---

## 🐛 Troubleshooting

### Common Issues:

1. **Build Errors**
   ```bash
   npx cap clean
   npm run build
   npx cap sync
   ```

2. **Android SDK Issues**
   - Ensure Android Studio is installed
   - Set ANDROID_HOME environment variable
   - Install required SDK platforms (API 33+)

3. **iOS Signing Issues**
   - Check Apple Developer account status
   - Verify Bundle ID matches provisioning profile
   - Ensure certificates are valid

4. **Permission Errors**
   - Check `android/app/src/main/AndroidManifest.xml`
   - Check `ios/App/App/Info.plist`
   - Required permissions are already configured

### Performance Optimization:
- Images are optimized for mobile
- Lazy loading implemented
- Service worker for offline capability
- PWA manifest configured

---

## 📊 Analytics & Monitoring

### Recommended Tools:
- **Firebase Analytics**: User behavior tracking
- **Crashlytics**: Crash reporting
- **Sentry**: Error monitoring
- **Mixpanel**: Event tracking

### Implementation Example:
```typescript
// Add to src/services/AnalyticsService.ts
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

export const trackEvent = (name: string, parameters?: any) => {
  FirebaseAnalytics.logEvent({
    name,
    parameters
  });
};
```

---

## 🔒 Security Checklist

### Before Publishing:
- [ ] Remove development/staging URLs
- [ ] Enable certificate pinning
- [ ] Implement proper authentication flows
- [ ] Add rate limiting
- [ ] Validate all user inputs
- [ ] Enable crash reporting
- [ ] Test offline functionality
- [ ] Verify payment security

### App Store Requirements:
- [ ] Privacy policy URL configured
- [ ] Terms of service available
- [ ] Data usage clearly described
- [ ] Age rating appropriate
- [ ] Content guidelines compliance

---

## 📈 Post-Launch

### Monitoring:
- App crashes and errors
- User retention metrics
- Performance metrics
- Store ratings and reviews

### Updates:
```bash
# For updates after changes
npm run build
npx cap sync
npx cap run android  # Test locally first
# Then rebuild and upload new version to stores
```

---

## 🆘 Support Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Ionic Framework**: https://ionicframework.com/docs
- **Google Play Console**: https://developer.android.com/distribute/console
- **App Store Connect**: https://developer.apple.com/app-store-connect/
- **Lovable Mobile Guide**: https://docs.lovable.dev/features/mobile-development

---

**🎉 Your Subhakaryam mobile app is ready for deployment!**

The app includes all modern mobile features and is optimized for both Android and iOS platforms. Follow this guide step-by-step for successful deployment to app stores.