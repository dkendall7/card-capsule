import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useDocumentScanner } from '@/src/lib/capture/useDocumentScanner';
import { colors, spacing, typography } from '@/src/lib/theme';

function CaptureScreen() {
  const { startScan, isScanning, result, error, isExpoGo } = useDocumentScanner();

  return (
    <View style={styles.container}>
      {isExpoGo && (
        <View style={styles.expoGoBanner}>
          <Text style={styles.expoGoText}>
            Document scanner requires a development build. Run: npx expo run:ios
          </Text>
        </View>
      )}

      <View style={styles.content}>
        {result?.scannedImages && result.scannedImages.length > 0 ? (
          <View style={styles.preview}>
            <Image
              source={{ uri: result.scannedImages[0] }}
              style={styles.previewImage}
              resizeMode="contain"
            />
            <Text style={styles.previewLabel}>Scanned successfully</Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>Ready to scan a card</Text>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            (isScanning || isExpoGo) && styles.startButtonDisabled,
            pressed && styles.startButtonPressed,
          ]}
          onPress={startScan}
          disabled={isScanning || isExpoGo}
        >
          <Text style={styles.startButtonText}>
            {isScanning ? 'Scanning…' : 'Start Scan'}
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  expoGoBanner: {
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryMuted,
  },
  expoGoText: {
    ...typography.sm,
    color: colors.textMuted,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    ...typography.base,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  preview: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  previewImage: {
    width: 280,
    height: 360,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
  },
  previewLabel: {
    ...typography.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  error: {
    ...typography.sm,
    color: '#dc2626',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: 12,
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonPressed: {
    opacity: 0.9,
  },
  startButtonText: {
    ...typography.base,
    fontWeight: typography.weights.semibold,
    color: '#ffffff',
  },
  backButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  backButtonText: {
    ...typography.base,
    color: colors.primary,
  },
});

export default CaptureScreen;
