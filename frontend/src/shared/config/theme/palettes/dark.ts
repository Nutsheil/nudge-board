import type { PaletteOptions } from '@mui/material/styles'

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#ff6a47',
    light: '#ff8769',
    dark: '#f0502e',
    contrastText: '#1a1208',
  },
  secondary: {
    main: '#a1a1aa',
    light: '#d4d4d8',
    dark: '#71717a',
    contrastText: '#1a1a1d',
  },
  error: { main: '#f87171', contrastText: '#1a1a1d' },
  warning: { main: '#fbbf24', contrastText: '#1a1a1d' },
  success: { main: '#34d399', contrastText: '#1a1a1d' },
  info: { main: '#38bdf8', contrastText: '#1a1a1d' },
  background: { default: '#0e0e10', paper: '#1a1a1d' },
  text: {
    primary: '#f4f4f5',
    secondary: '#a1a1aa',
    disabled: '#52525b',
  },
  divider: '#2a2a2e',
  action: {
    hover: '#ff6a4722',
    selected: '#ff6a4733',
    disabledBackground: '#1f1f23',
    disabled: '#5b5b63',
  },
  surface: {
    cardDeep: '#151518',
    pill: '#1f1f23',
    pillHover: '#27272b',
    mockupHeader: '#151518',
    ctaGradientTop: '#18181b',
    heroGradientStart: '#1a1a1d',
    heroGradientMid: '#141416',
    heroGradientEnd: '#0e0e10',
  },
  textExtra: {
    tertiary: '#71717a',
    quaternary: '#52525b',
  },
}
