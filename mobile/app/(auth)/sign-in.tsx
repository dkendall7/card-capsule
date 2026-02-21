import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSession } from '@/src/lib/auth/session';
import { colors, spacing, typography } from '@/src/lib/theme';

export default function SignInScreen() {
  const { signIn } = useSession();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CardCapsule</Text>
      <Text style={styles.subtitle}>Your memory-safe for cards</Text>
      <Pressable
        style={({ pressed }: { pressed: boolean }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => {
          signIn();
          router.replace('/');
        }}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.base,
    color: colors.textMuted,
    marginBottom: spacing.xxl,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: 12,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    ...typography.base,
    fontWeight: typography.weights.semibold,
    color: '#ffffff',
  },
});
