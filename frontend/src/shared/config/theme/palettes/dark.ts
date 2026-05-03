import type { PaletteOptions } from '@mui/material/styles'

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#a855f7',
    light: '#c084fc',
    dark: '#7c3aed',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#a78bfa',
    light: '#c4b5fd',
    dark: '#5b21b6',
    contrastText: '#ffffff',
  },
  error: { main: '#ef4444', contrastText: '#ffffff' },
  warning: { main: '#fbbf24', contrastText: '#0d0a1e' },
  success: { main: '#34d399', contrastText: '#0d0a1e' },
  info: { main: '#61dafb', contrastText: '#0d0a1e' },
  background: { default: '#0d0a1e', paper: '#1a1035' },
  text: {
    primary: '#ffffff',
    secondary: '#b8b1ce',
    disabled: '#6b6485',
  },
  divider: '#2d1b69',
  action: {
    hover: '#a855f720',
    selected: '#a855f730',
    disabledBackground: '#1f1535',
    disabled: '#5b5b8a',
  },
  surface: {
    cardDeep: '#130d2a',
    pill: '#1e1040',
    pillHover: '#221350',
    mockupHeader: '#110c28',
    ctaGradientTop: '#1a0d3d',
  },
  textExtra: {
    tertiary: '#71717a',
    quaternary: '#4a3f6b',
  },
}
