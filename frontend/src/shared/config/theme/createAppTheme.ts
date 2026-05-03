import { createTheme, type Theme } from '@mui/material/styles'

import { createComponents } from './components'
import { palettes, type PaletteName } from './palettes'
import { createResponsiveTypography, shape, spacing, typography } from './tokens'

declare module '@mui/material/Button' {
  interface ButtonPropsSizeOverrides {
    extraLarge: true
  }
}

export const createAppTheme = (paletteName: PaletteName): Theme => {
  const base = createTheme({
    palette: palettes[paletteName],
    typography,
    shape,
    spacing,
  })

  return createTheme(base, {
    components: createComponents(base),
    typography: createResponsiveTypography(base),
  })
}
