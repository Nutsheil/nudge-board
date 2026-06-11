import type { Theme, ThemeOptions } from '@mui/material/styles'

export const createComponents = (base: Theme): ThemeOptions['components'] => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        fontOpticalSizing: 'auto',
        fontKerning: 'normal',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '*': {
        scrollbarWidth: 'thin',
        scrollbarColor: `${base.palette.divider} transparent`,
      },
      '*::-webkit-scrollbar': { width: 6, height: 6 },
      '*::-webkit-scrollbar-track': { background: 'transparent' },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: base.palette.divider,
        borderRadius: 3,
      },
      'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
        {
          WebkitBoxShadow: `0 0 0 1000px ${base.palette.background.paper} inset !important`,
          WebkitTextFillColor: `${base.palette.text.primary} !important`,
          borderColor: 'inherit !important',
          outline: 'none !important',
          borderRadius: '0 !important',
        },
    },
  },
  MuiButton: {
    variants: [
      ...(base.palette.mode === 'light'
        ? [
            {
              props: { variant: 'contained' as const, color: 'primary' as const },
              style: {
                backgroundColor: base.palette.primary.dark,
                '&:hover': { backgroundColor: '#b3300f' },
              },
            },
          ]
        : []),
      {
        props: { size: 'extraLarge' },
        style: {
          paddingInline: base.spacing(3.5),
          paddingBlock: base.spacing(1.75),
          borderRadius: base.radii.lg,
        },
      },
    ],
  },
  MuiPaper: {
    styleOverrides: { root: { backgroundImage: 'none' } },
  },
  MuiCard: {
    styleOverrides: { root: { borderRadius: base.radii.lg } },
  },
  MuiDialog: {
    styleOverrides: { paper: { borderRadius: base.radii.lg } },
  },
  MuiMenu: {
    styleOverrides: { paper: { borderRadius: base.radii.md } },
  },
  MuiPopover: {
    styleOverrides: { paper: { borderRadius: base.radii.md } },
  },
})
