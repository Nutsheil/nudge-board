import { alpha, darken, lighten, type Theme } from '@mui/material'

import type { LabelColor } from '../model/types'

// Curated label palette: one hue per token. The raw hex is used for the solid
// swatch/dot indicators; chip text/fill are derived per-theme (see labelChipSx).
export const LABEL_HEX: Record<LabelColor, string> = {
  SLATE: '#64748b',
  RED: '#ef4444',
  ORANGE: '#f97316',
  AMBER: '#f59e0b',
  GREEN: '#22c55e',
  TEAL: '#14b8a6',
  BLUE: '#3b82f6',
  INDIGO: '#6366f1',
  PURPLE: '#a855f7',
  PINK: '#ec4899',
}

// Theme-aware sx for a small label chip: a soft tint of the hue with text
// shifted toward ink (light) or toward white (dark). The shift factors are
// tuned so every palette hue clears WCAG AA (4.5:1) on both themes' surfaces —
// the raw hue as text fails badly on a light tint (amber/green ~1.8:1).
export const labelChipSx = (color: LabelColor) => (theme: Theme) => {
  const hue = LABEL_HEX[color]
  const dark = theme.palette.mode === 'dark'
  return {
    bgcolor: alpha(hue, dark ? 0.2 : 0.14),
    color: dark ? lighten(hue, 0.3) : darken(hue, 0.5),
    border: '1px solid',
    borderColor: alpha(hue, dark ? 0.35 : 0.3),
    fontWeight: 500,
  }
}
