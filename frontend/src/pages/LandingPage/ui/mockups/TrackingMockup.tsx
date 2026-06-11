import { Box, Stack, Typography } from '@mui/material'

import { fontFamilyMonospace, radii } from '@/shared/config/theme'

import { Bar } from './primitives'

const ENTRIES = [
  { w: 120, time: '2:10' },
  { w: 92, time: '3:45' },
  { w: 140, time: '1:05' },
  { w: 74, time: '0:40' },
]

export const TrackingMockup = () => (
  <Stack spacing={1.5} sx={{ height: '100%', p: 2, bgcolor: 'background.default' }}>
    <Stack
      direction='row'
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: `${radii.md}px`,
        px: 1.75,
        py: 1.5,
      }}
    >
      <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
        <Typography variant='h5' component='span' sx={{ fontFamily: fontFamilyMonospace, color: 'text.primary' }}>
          01:24:36
        </Typography>
      </Stack>
      <Bar w={70} h={7} color='divider' />
    </Stack>

    <Stack sx={{ flex: 1 }}>
      {ENTRIES.map((e, i) => (
        <Stack
          key={i}
          direction='row'
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.1,
            borderBottom: i < ENTRIES.length - 1 ? 1 : 0,
            borderColor: 'divider',
          }}
        >
          <Bar w={e.w} h={7} />
          <Typography sx={{ fontFamily: fontFamilyMonospace, fontSize: 12, color: 'text.secondary' }}>
            {e.time}
          </Typography>
        </Stack>
      ))}
    </Stack>
  </Stack>
)
