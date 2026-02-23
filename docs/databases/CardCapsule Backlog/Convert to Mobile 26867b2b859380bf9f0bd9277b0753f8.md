# Convert to Mobile

Status: To do
Priority: Must have

To convert your CardCapsule web app to a native mobile app, you have several options. Let me first examine your current tech stack to give you the most relevant recommendations.

[3 tools called]

Based on your current React + TypeScript + Vite + Supabase stack, here are your main options for converting to a native mobile app:

## **Option 1: React Native (Recommended)**

**Best for: Maximum code reuse, native performance**

### What you'd need to do:

1. **Create a new React Native project** alongside your web app
2. **Port your components** - Most of your React components can be adapted
3. **Replace web-specific libraries:**
    - `react-router-dom` → `@react-navigation/native`
    - `@radix-ui/*` → `react-native` components or `react-native-elements`
    - `tailwindcss` → `styled-components` or `nativewind`
4. **Keep the same:**
    - Supabase client (works great with React Native)
    - React Query
    - Your business logic and hooks
    - TypeScript types

### Migration effort: **Medium** (60-70% code reuse)

## **Option 2: Expo (Easiest)**

**Best for: Quickest path to mobile, managed workflow**

### What you'd need to do:

1. **Initialize Expo project** with TypeScript
2. **Use Expo Router** for navigation (similar to Next.js)
3. **Adapt UI components** using Expo's component library
4. **Same Supabase integration**

### Migration effort: **Low-Medium** (50-60% code reuse)

## **Option 3: Capacitor (Hybrid)**

**Best for: Minimal changes, web-to-mobile wrapper**

### What you'd need to do:

1. **Add Capacitor** to your existing Vite project
2. **Install mobile plugins** for camera, file system, etc.
3. **Adapt touch interactions** and mobile-specific UX
4. **Keep most of your existing code**

### Migration effort: **Low** (80-90% code reuse)

## **Option 4: Flutter**

**Best for: True native performance, but complete rewrite**

### What you'd need to do:

1. **Complete rewrite** in Dart
2. **Recreate all UI** using Flutter widgets
3. **Port business logic** to Dart
4. **Use Supabase Dart client**

### Migration effort: **High** (10-20% code reuse)

## **My Recommendation: React Native + Expo**

Given your current stack, I'd recommend **React Native with Expo** because:

1. **High code reuse** - Your React components, hooks, and business logic can mostly stay
2. **Supabase works perfectly** - Same client, same queries
3. **Great developer experience** - Hot reload, TypeScript support
4. **Easy deployment** - Expo handles builds and app store submissions
5. **Future-proof** - Can eject to bare React Native if needed

### Next Steps if you choose React Native:

1. Create new Expo project: `npx create-expo-app CardCapsuleMobile --template`
2. Install Supabase: `npm install @supabase/supabase-js`
3. Copy your `src/integrations/supabase/` folder
4. Port your components one by one
5. Set up navigation with Expo Router

Would you like me to help you get started with any of these approaches?