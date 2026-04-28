import { createTheme, type Theme } from '@mui/material/styles'

import { palettes, type PaletteName } from './palettes'
import { shape, spacing, typography } from './tokens'

export const createAppTheme = (paletteName: PaletteName): Theme =>
  createTheme({
    palette: palettes[paletteName],
    typography,
    shape,
    spacing,
  })
