import type { PaletteOptions } from '@mui/material/styles'

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#7c3aed',
    light: '#a855f7',
    dark: '#5b21b6',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#a78bfa',
    light: '#c4b5fd',
    dark: '#5b21b6',
    contrastText: '#ffffff',
  },
  error: { main: '#e0234e', contrastText: '#ffffff' },
  warning: { main: '#d97706', contrastText: '#ffffff' },
  success: { main: '#15803d', contrastText: '#ffffff' },
  info: { main: '#0284c7', contrastText: '#ffffff' },
  background: { default: '#faf9fc', paper: '#ffffff' },
  text: {
    primary: '#0d0a1e',
    secondary: '#4a3f6b',
    disabled: '#a1a1aa',
  },
  divider: '#e5e4e7',
  action: {
    hover: '#7c3aed10',
    selected: '#7c3aed20',
  },
  surface: {
    cardDeep: '#f4f1fb',
    pill: '#ede7f9',
    pillHover: '#e0d6f5',
    mockupHeader: '#f7f5fc',
    ctaGradientTop: '#efe9fb',
  },
  textExtra: {
    tertiary: '#6b6478',
    quaternary: '#8a839c',
  },
}
