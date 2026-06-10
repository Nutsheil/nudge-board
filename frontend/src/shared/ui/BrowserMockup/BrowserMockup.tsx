import { Box, Stack } from '@mui/material'
import type { ReactNode } from 'react'

import { radii } from '@/shared/config/theme'

const TRAFFIC_LIGHTS = ['#ff5f57', '#febc2e', '#28c840']

type BrowserMockupProps = {
  children?: ReactNode
  label?: string
  height?: number
}

export const BrowserMockup = ({ children, label, height = 380 }: BrowserMockupProps) => (
  <Box
    role='img'
    aria-label={label}
    sx={{
      width: '100%',
      flex: 1,
      height,
      bgcolor: 'background.paper',
      border: 1,
      borderColor: 'divider',
      borderRadius: `${radii.lg}px`,
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
        flexShrink: 0,
      }}
    >
      {TRAFFIC_LIGHTS.map((color) => (
        <Box key={color} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
      ))}
      <Box sx={{ flex: 1, ml: 1, height: 22, borderRadius: `${radii.sm}px`, bgcolor: 'background.default' }} />
    </Stack>

    <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</Box>
  </Box>
)
