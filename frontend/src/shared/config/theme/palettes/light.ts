import type { PaletteOptions } from '@mui/material/styles'

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#f0502e',
    light: '#ff6a47',
    dark: '#d83e1e',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#52525b',
    light: '#71717a',
    dark: '#3f3f46',
    contrastText: '#ffffff',
  },
  error: { main: '#dc2626', contrastText: '#ffffff' },
  warning: { main: '#d97706', contrastText: '#ffffff' },
  success: { main: '#16a34a', contrastText: '#ffffff' },
  info: { main: '#0284c7', contrastText: '#ffffff' },
  background: { default: '#fafafa', paper: '#ffffff' },
  text: {
    primary: '#18181b',
    secondary: '#52525b',
    disabled: '#a1a1aa',
  },
  divider: '#e4e4e7',
  action: {
    hover: '#f0502e12',
    selected: '#f0502e1f',
  },
  surface: {
    cardDeep: '#f4f4f5',
    pill: '#f4f4f5',
    pillHover: '#e4e4e7',
    mockupHeader: '#f4f4f5',
    ctaGradientTop: '#f4f4f5',
    heroGradientStart: '#f4f4f5',
    heroGradientMid: '#ececee',
    heroGradientEnd: '#fafafa',
  },
  textExtra: {
    tertiary: '#71717a',
    quaternary: '#a1a1aa',
  },
}
