# Mobile Application Setup

The Berserker Logging Tool has been configured as a mobile application using Capacitor.

## Prerequisites

### For Android Development
- **Android Studio** (latest version)
- **Java Development Kit (JDK)** 11 or higher
- **Android SDK** (installed via Android Studio)

### For iOS Development (macOS only)
- **Xcode** 14 or higher
- **CocoaPods** (`sudo gem install cocoapods`)
- **Apple Developer Account** (for device testing and distribution)

## Available Scripts

### Build and Sync
```bash
npm run cap:sync
```
Builds the web assets and syncs them to both Android and iOS platforms.

### Open in Native IDEs
```bash
npm run cap:open:android   # Opens Android Studio
npm run cap:open:ios       # Opens Xcode (macOS only)
```

### Run on Device/Emulator
```bash
npm run cap:run:android    # Build, sync, and run on Android
npm run cap:run:ios        # Build, sync, and run on iOS (macOS only)
```

## Development Workflow

1. **Make changes to your web app** (React components, styles, etc.)

2. **Build and sync to native platforms:**
   ```bash
   npm run cap:sync
   ```

3. **Open in native IDE to run/debug:**
   ```bash
   npm run cap:open:android
   # or
   npm run cap:open:ios
   ```

4. **Run directly from command line:**
   ```bash
   npm run cap:run:android
   # or
   npm run cap:run:ios
   ```

## First Time Setup

### Android
1. Install Android Studio from https://developer.android.com/studio
2. Open Android Studio and install Android SDK
3. Run `npm run cap:open:android`
4. In Android Studio, click the green "Run" button to launch on emulator or connected device

### iOS (macOS only)
1. Install Xcode from the Mac App Store
2. Install CocoaPods: `sudo gem install cocoapods`
3. Run `npm run cap:open:ios`
4. In Xcode, select a simulator or connected device
5. Click the "Run" button (▶️) to launch the app

## Building for Production

### Android APK/AAB
1. Open Android Studio: `npm run cap:open:android`
2. Go to **Build > Generate Signed Bundle / APK**
3. Follow the wizard to create a signed release build

### iOS IPA
1. Open Xcode: `npm run cap:open:ios`
2. Select **Product > Archive**
3. Once archived, use the Organizer to distribute to App Store or TestFlight

## Project Structure

```
logging-tool/
├── android/              # Android native project
├── ios/                  # iOS native project
├── dist/                 # Built web assets (synced to native apps)
├── capacitor.config.ts   # Capacitor configuration
└── src/                  # React source code
```

## Configuration

The Capacitor configuration is in `capacitor.config.ts`:

```typescript
{
  appId: 'com.berserker.loggingtool',
  appName: 'Berserker Logging Tool',
  webDir: 'dist'
}
```

## Notes

- Always run `npm run build` before syncing to native platforms
- The web app runs inside a native WebView on mobile devices
- All web features (React, TypeScript, Tailwind) work the same on mobile
- The app works offline once loaded
- LocalStorage persists data on the device

## Troubleshooting

### Android Studio doesn't recognize project
- Make sure Android SDK is installed
- Try **File > Invalidate Caches / Restart** in Android Studio
- Re-run `npm run cap:sync`

### iOS build fails
- Make sure CocoaPods is installed: `pod --version`
- Try running `pod install` in the `ios/App` directory
- Re-run `npm run cap:sync`

### Changes not showing in app
- Make sure to run `npm run build` after making changes
- Run `npm run cap:sync` to copy changes to native projects
- Rebuild the app in Android Studio or Xcode

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
