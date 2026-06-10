import type { Theme, ThemeOptions } from '@mui/material/styles'

const sansStack = "'Geist Variable', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

export const fontFamilyMonospace =
  "'Geist Mono Variable', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"

export const typography: ThemeOptions['typography'] = {
  fontFamily: sansStack,
  h1: { fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.022em' },
  h2: { fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' },
  h3: { fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.015em' },
  h4: { fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' },
  h5: { fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' },
  h6: { fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.005em' },
  subtitle1: { fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.5 },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.55 },
  button: { fontSize: '0.9375rem', fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.4 },
  overline: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: 1.4,
  },
}

export const shape: ThemeOptions['shape'] = {
  borderRadius: 12,
}

export const spacing: ThemeOptions['spacing'] = 8

export const createResponsiveTypography = (base: Theme): ThemeOptions['typography'] => ({
  h1: {
    fontSize: '2.125rem',
    [base.breakpoints.up('sm')]: { fontSize: '2.5rem' },
    [base.breakpoints.up('lg')]: { fontSize: '3rem' },
  },
  h2: {
    fontSize: '1.75rem',
    [base.breakpoints.up('sm')]: { fontSize: '2rem' },
    [base.breakpoints.up('lg')]: { fontSize: '2.5rem' },
  },
  h3: {
    fontSize: '1.5rem',
    [base.breakpoints.up('sm')]: { fontSize: '1.75rem' },
    [base.breakpoints.up('lg')]: { fontSize: '2rem' },
  },
  h4: {
    fontSize: '1.25rem',
    [base.breakpoints.up('sm')]: { fontSize: '1.375rem' },
    [base.breakpoints.up('lg')]: { fontSize: '1.625rem' },
  },
  h5: {
    fontSize: '1.125rem',
    [base.breakpoints.up('sm')]: { fontSize: '1.25rem' },
    [base.breakpoints.up('lg')]: { fontSize: '1.375rem' },
  },
  h6: {
    fontSize: '1rem',
    [base.breakpoints.up('sm')]: { fontSize: '1.0625rem' },
    [base.breakpoints.up('lg')]: { fontSize: '1.125rem' },
  },
  subtitle1: {
    fontSize: '1rem',
    [base.breakpoints.up('sm')]: { fontSize: '1.0625rem' },
    [base.breakpoints.up('lg')]: { fontSize: '1.125rem' },
  },
})
