import type { PaletteOptions } from '@mui/material/styles'
import { lightPalette } from './light'
import { darkPalette } from './dark'

export const palettes = {
  light: lightPalette,
  dark: darkPalette,
} satisfies Record<string, PaletteOptions>

export type PaletteName = keyof typeof palettes
