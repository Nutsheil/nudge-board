import { enUS, ruRU } from '@mui/material/locale'
import { createTheme, type Theme } from '@mui/material/styles'

import type { Language } from '../i18n'
import { createComponents } from './components'
import { palettes, type PaletteName } from './palettes'
import { createResponsiveTypography, shape, spacing, typography } from './tokens'

declare module '@mui/material/Button' {
  interface ButtonPropsSizeOverrides {
    extraLarge: true
  }
}

const muiLocales = {
  ru: ruRU,
  en: enUS,
}

export const createAppTheme = (paletteName: PaletteName, language: Language): Theme => {
  const base = createTheme({
    palette: palettes[paletteName],
    typography,
    shape,
    spacing,
  })

  return createTheme(
    base,
    {
      components: createComponents(base),
      typography: createResponsiveTypography(base),
    },
    muiLocales[language],
  )
}
