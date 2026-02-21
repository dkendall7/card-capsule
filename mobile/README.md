# CardCapsule Mobile

Expo app for CardCapsule — a memory-safe for sentimental cards.

## Prerequisites

- Node.js 18+
- npm or yarn
- [Expo Go](https://expo.dev/go) on your device, or iOS Simulator / Android Emulator

## How to Run

```bash
cd mobile
npx expo start
```

Then:

- **iOS Simulator**: Press `i` in the terminal, or scan the QR code with your camera (opens in Simulator)
- **Android Emulator**: Press `a` in the terminal
- **Physical device**: Install Expo Go, scan the QR code

## Phase 0 Status

This is the Phase 0 bootstrap. It includes:

- Auth route grouping (signed-out vs signed-in)
- Mock sign-in (tap "Sign In" to enter; session resets on app restart)
- Minimal Home screen with Add Card CTA, resurfacing module, and cards feed placeholders

No backend integration yet. Supabase auth and real data come in Phase 2.
