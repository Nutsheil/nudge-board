import type { Theme, ThemeOptions } from '@mui/material/styles'

export const createComponents = (base: Theme): ThemeOptions['components'] => ({
  MuiCssBaseline: {
    styleOverrides: {
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
    },
  },
  MuiButton: {
    variants: [
      {
        props: { size: 'extraLarge' },
        style: {
          paddingInline: base.spacing(3.5),
          paddingBlock: base.spacing(1.75),
          borderRadius: Number(base.shape.borderRadius) * 1.25,
        },
      },
    ],
  },
})
