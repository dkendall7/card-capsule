# Capture Tech Decision — Phase 1

## Library Chosen

**react-native-document-scanner-plugin** (v2.0.4)

- **iOS:** Apple VisionKit
- **Android:** Google ML Kit Document Scanner API

## Requirements Coverage

| Requirement | Support |
|-------------|---------|
| Edge/rectangle detection overlay | Yes — native live overlay on camera preview |
| Perspective correction / de-skew | Yes — built-in crop and warp |
| Auto-capture when stable | Yes — ML Kit/VisionKit auto-capture when document is steady |
| Manual shutter fallback | Yes — native UI includes manual capture button |

## Expo Go vs Development Build

**Does not work in Expo Go.** The plugin uses native code (VisionKit, ML Kit) that is not bundled in Expo Go.

**Requires a development build.** Use one of:

```bash
# Local dev build
npx expo run:ios
npx expo run:android

# EAS Build
eas build --profile development --platform ios
eas build --profile development --platform android
```

## Tradeoffs and Limitations

### Tradeoffs

- **Native modal UI:** The scanner opens as a full-screen native experience. We cannot fully customize the overlay or branding within the scan flow.
- **No Expo Go:** Developers must use a dev build to test capture on device.
- **Platform differences:** Android and iOS use different native frameworks; behavior and UX can differ slightly.

### Limitations

- Full-screen takeover during scan — no embedded camera in our own screen.
- Android: `maxNumDocuments` can limit scans (e.g. 2 for front + inside); iOS handles multi-page differently.
- Low-contrast backgrounds can make edge detection less reliable.

## Why This Path for App-Store Quality

1. **Production-grade APIs:** VisionKit and ML Kit are used by major apps for document scanning.
2. **All four requirements met:** Overlay, perspective correction, auto-capture, and manual fallback are built in.
3. **Maintained:** Active development and Expo config plugin support.
4. **No custom CV:** Avoids building our own edge detection or perspective math; native implementations are optimized and reliable.

## Alternatives Considered

- **react-native-rectangle-scanner:** Archived (Aug 2024), unmaintained.
- **expo-camera only:** No edge detection, no perspective correction; would require custom JS overlay (impractical for real-time).
- **Scanbot SDK:** Commercial, licensing cost.
