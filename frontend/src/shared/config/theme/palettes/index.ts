import type { PaletteOptions } from '@mui/material/styles'

import { darkPalette } from './dark'
import { lightPalette } from './light'

export const palettes = {
  light: lightPalette,
  dark: darkPalette,
} satisfies Record<string, PaletteOptions>

export type PaletteName = keyof typeof palettes
