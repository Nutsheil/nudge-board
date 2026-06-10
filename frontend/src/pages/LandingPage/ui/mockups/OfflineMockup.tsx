import CheckIcon from '@mui/icons-material/Check'
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined'
import { Box, Stack } from '@mui/material'

import { radii } from '@/shared/config/theme'

import { Bar } from './primitives'

const ROWS = [
  { w: 130, synced: true },
  { w: 102, synced: true },
  { w: 148, synced: false },
  { w: 84, synced: false },
]

export const OfflineMockup = () => (
  <Stack spacing={1.5} sx={{ height: '100%', p: 2, bgcolor: 'background.default' }}>
    <Stack
      direction='row'
      spacing={1.25}
      sx={{
        alignItems: 'center',
        bgcolor: 'surface.cardDeep',
        border: 1,
        borderColor: 'divider',
        borderRadius: `${radii.md}px`,
        p: 1.5,
      }}
    >
      <CloudOffOutlinedIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
      <Stack spacing={0.6} sx={{ flex: 1 }}>
        <Bar w='45%' h={7} color='text.secondary' />
        <Bar w='70%' h={6} />
      </Stack>
    </Stack>

    <Stack sx={{ flex: 1 }}>
      {ROWS.map((r, i) => (
        <Stack
          key={i}
          direction='row'
          spacing={1.25}
          sx={{
            alignItems: 'center',
            py: 1.1,
            borderBottom: i < ROWS.length - 1 ? 1 : 0,
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: r.synced ? 'success.main' : 'transparent',
              border: r.synced ? 0 : 1,
              borderColor: 'divider',
            }}
          >
            {r.synced && <CheckIcon sx={{ fontSize: 11, color: 'success.contrastText' }} />}
          </Box>
          <Bar w={r.w} h={7} />
        </Stack>
      ))}
    </Stack>
  </Stack>
)
