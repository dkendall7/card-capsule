/**
 * CardCapsule theme tokens — colors, spacing, typography.
 * Aligned with emotional/memory-safe feel.
 */

export const colors = {
  primary: '#6366f1',
  primaryMuted: '#a5b4fc',
  secondary: '#8b5cf6',
  background: '#fafafa',
  surface: '#ffffff',
  surfaceMuted: '#f4f4f5',
  text: '#18181b',
  textMuted: '#71717a',
  border: '#e4e4e7',
  borderMuted: '#f4f4f5',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const typography = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 24, lineHeight: 32 },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;
