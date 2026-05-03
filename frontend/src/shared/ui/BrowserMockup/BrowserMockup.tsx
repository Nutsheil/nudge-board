import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

import { fontFamilyMonospace } from '@/shared/config/theme'

const TRAFFIC_LIGHTS = ['#ff5f57', '#febc2e', '#28c840']

type BrowserMockupProps = {
  icon: ReactNode
  label: string
  height?: number
}

export const BrowserMockup = ({ icon, label, height = 380 }: BrowserMockupProps) => (
  <Box
    sx={{
      width: '100%',
      flex: 1,
      height,
      bgcolor: 'background.paper',
      border: 1,
      borderColor: 'divider',
      borderRadius: 1.5,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Stack
      direction='row'
      spacing={1}
      sx={{
        height: 38,
        px: 1.75,
        bgcolor: (t) => t.palette.surface.mockupHeader,
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      {TRAFFIC_LIGHTS.map((color) => (
        <Box key={color} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
      ))}
      <Box sx={{ flex: 1, ml: 1, height: 22, borderRadius: 0.5, bgcolor: 'background.default' }} />
    </Stack>

    <Stack spacing={1} sx={{ flex: 1, px: 2, alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ color: 'primary.main', opacity: 0.5, display: 'flex', '& svg': { fontSize: 36 } }}>{icon}</Box>
      <Typography variant='body2' sx={{ color: (t) => t.palette.textExtra.tertiary, fontFamily: fontFamilyMonospace }}>
        {label}
      </Typography>
      <Typography
        variant='caption'
        sx={{ color: (t) => t.palette.textExtra.quaternary, fontFamily: fontFamilyMonospace }}
      >
        [Visual placeholder]
      </Typography>
    </Stack>
  </Box>
)
