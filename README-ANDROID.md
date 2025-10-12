# Converting MindMate to Android App

## Method 1: Capacitor (Recommended)

### Step 1: Install Capacitor
\`\`\`bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init MindMate com.mindmate.app
\`\`\`

### Step 2: Build and Add Android Platform
\`\`\`bash
npm run build
npx cap add android
npx cap sync
\`\`\`

### Step 3: Configure Android Permissions
Add to `android/app/src/main/AndroidManifest.xml`:
\`\`\`xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
\`\`\`

### Step 4: Open in Android Studio
\`\`\`bash
npx cap open android
\`\`\`

### Step 5: Build APK
In Android Studio:
1. Build → Generate Signed Bundle/APK
2. Choose APK
3. Create keystore or use existing
4. Build release APK

## Method 2: React Native Conversion

### Step 1: Create React Native Project
\`\`\`bash
npx react-native init MindMateApp
cd MindMateApp
\`\`\`

### Step 2: Install Voice Dependencies
\`\`\`bash
npm install @react-native-voice/voice
npm install react-native-tts
npm install @react-native-async-storage/async-storage
\`\`\`

### Step 3: Android Permissions
Add to `android/app/src/main/AndroidManifest.xml`:
\`\`\`xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
\`\`\`

### Step 4: Convert Components
Replace web APIs with React Native equivalents:
- `useSpeechRecognition` → `@react-native-voice/voice`
- `useTextToSpeech` → `react-native-tts`
- `localStorage` → `@react-native-async-storage/async-storage`

## Method 3: PWA (Progressive Web App)

### Step 1: Add PWA Configuration
Create `public/manifest.json`:
\`\`\`json
{
  "name": "MindMate",
  "short_name": "MindMate",
  "description": "Your AI Mental Health Companion",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10b981",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
\`\`\`

### Step 2: Add Service Worker
Create `public/sw.js`:
\`\`\`javascript
const CACHE_NAME = 'mindmate-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
\`\`\`

### Step 3: Register Service Worker
Add to `public/index.html`:
\`\`\`html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
</script>
\`\`\`

## Recommended Approach: Capacitor

Capacitor is the best choice because:
1. ✅ Keeps your existing React/Next.js code
2. ✅ Easy to deploy to app stores
3. ✅ Native device access (microphone, storage)
4. ✅ Automatic updates
5. ✅ Cross-platform (iOS + Android)

## Building for Production

### Android APK Steps:
1. `npm run build`
2. `npx cap sync`
3. `npx cap open android`
4. In Android Studio: Build → Generate Signed Bundle/APK
5. Upload to Google Play Store

### iOS App Steps:
1. `npm install @capacitor/ios`
2. `npx cap add ios`
3. `npx cap open ios`
4. In Xcode: Product → Archive
5. Upload to App Store Connect

Your MindMate app will work perfectly as a native mobile app with full voice functionality!
