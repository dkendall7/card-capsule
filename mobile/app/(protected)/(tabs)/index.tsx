import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/src/lib/theme';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Prominent Add Card CTA */}
      <Pressable
        style={({ pressed }: { pressed: boolean }) => [styles.addCardCta, pressed && styles.addCardCtaPressed]}
        onPress={() => {
          // Placeholder — non-functional for Phase 0
        }}
      >
        <Text style={styles.addCardCtaIcon}>+</Text>
        <Text style={styles.addCardCtaText}>Add Card</Text>
        <Text style={styles.addCardCtaSubtext}>Capture a new memory</Text>
      </Pressable>

      {/* Placeholder resurfacing module */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resurfacing</Text>
        <View style={styles.resurfacingCard}>
          <Text style={styles.resurfacingText}>Memories from today</Text>
          <Text style={styles.resurfacingSubtext}>No cards to resurface yet</Text>
        </View>
      </View>

      {/* Placeholder cards feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Cards</Text>
        <View style={styles.cardPlaceholder}>
          <View style={styles.cardThumb} />
          <Text style={styles.cardLabel}>Card 1</Text>
        </View>
        <View style={styles.cardPlaceholder}>
          <View style={styles.cardThumb} />
          <Text style={styles.cardLabel}>Card 2</Text>
        </View>
        <View style={styles.cardPlaceholder}>
          <View style={styles.cardThumb} />
          <Text style={styles.cardLabel}>Card 3</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  addCardCta: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  addCardCtaPressed: {
    opacity: 0.95,
  },
  addCardCtaIcon: {
    fontSize: 40,
    color: '#ffffff',
    marginBottom: spacing.sm,
  },
  addCardCtaText: {
    ...typography.xl,
    fontWeight: typography.weights.bold,
    color: '#ffffff',
  },
  addCardCtaSubtext: {
    ...typography.sm,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  resurfacingCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resurfacingText: {
    ...typography.base,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  resurfacingSubtext: {
    ...typography.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  cardPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.lg,
  },
  cardLabel: {
    ...typography.base,
    color: colors.text,
  },
});
