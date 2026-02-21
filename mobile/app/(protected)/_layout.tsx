import { Redirect, Stack } from 'expo-router';
import { Text } from 'react-native';

import { useSession } from '@/src/lib/auth/session';

export default function ProtectedLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
