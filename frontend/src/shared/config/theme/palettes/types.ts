import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      cardDeep: string
      pill: string
      pillHover: string
      mockupHeader: string
      ctaGradientTop: string
    }
    textExtra: {
      tertiary: string
      quaternary: string
    }
  }
  interface PaletteOptions {
    surface?: Partial<Palette['surface']>
    textExtra?: Partial<Palette['textExtra']>
  }
}
