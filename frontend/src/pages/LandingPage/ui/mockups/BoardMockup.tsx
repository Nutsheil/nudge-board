import CheckIcon from '@mui/icons-material/Check'
import { Box, Stack, Typography } from '@mui/material'

import { radii } from '@/shared/config/theme'

import { Bar } from './primitives'

type MockCard = { lines: (number | string)[]; tag?: 'high' | 'mid'; done?: boolean }
type MockColumn = { active?: boolean; count: number; titleW: number; cards: MockCard[] }

const COLUMNS: MockColumn[] = [
  { count: 3, titleW: 54, cards: [{ lines: ['90%', '60%'] }, { lines: ['75%'], tag: 'mid' }] },
  { active: true, count: 2, titleW: 46, cards: [{ lines: ['85%', '55%'], tag: 'high' }, { lines: ['70%'] }] },
  {
    count: 5,
    titleW: 40,
    cards: [
      { lines: ['65%'], done: true },
      { lines: ['80%'], done: true },
    ],
  },
]

const TAG = {
  high: { w: 30, color: 'primary.main' },
  mid: { w: 22, color: 'text.disabled' },
} as const

const MiniCard = ({ card }: { card: MockCard }) => (
  <Stack
    spacing={0.75}
    sx={{
      bgcolor: 'background.paper',
      border: 1,
      borderColor: 'divider',
      borderRadius: `${radii.sm}px`,
      p: 1,
      opacity: card.done ? 0.6 : 1,
    }}
  >
    {card.tag && (
      <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center' }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: TAG[card.tag].color }} />
        <Bar w={TAG[card.tag].w} h={5} color={TAG[card.tag].color} />
      </Stack>
    )}
    <Stack direction='row' spacing={0.75} sx={{ alignItems: 'flex-start' }}>
      {card.done && <CheckIcon sx={{ fontSize: 12, color: 'success.main', mt: '1px' }} />}
      <Stack spacing={0.5} sx={{ flex: 1 }}>
        {card.lines.map((w, i) => (
          <Bar key={i} w={w} h={6} />
        ))}
      </Stack>
    </Stack>
    <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', pt: 0.25 }}>
      <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: 'surface.pillHover' }} />
      <Box sx={{ flex: 1 }} />
      <Bar w={26} color='divider' />
    </Stack>
  </Stack>
)

export const BoardMockup = () => (
  <Stack direction='row' spacing={1.25} sx={{ height: '100%', p: 1.5, bgcolor: 'background.default' }}>
    {COLUMNS.map((col, i) => (
      <Stack
        key={i}
        spacing={1}
        sx={{ flex: 1, minWidth: 0, bgcolor: 'surface.cardDeep', borderRadius: `${radii.md}px`, p: 1 }}
      >
        <Stack direction='row' spacing={0.75} sx={{ alignItems: 'center', px: 0.5, pb: 0.25 }}>
          <Box
            sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: col.active ? 'primary.main' : 'text.disabled' }}
          />
          <Bar w={col.titleW} color='text.secondary' />
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: 10, fontWeight: 600, color: 'text.disabled' }}>{col.count}</Typography>
        </Stack>
        {col.cards.map((c, j) => (
          <MiniCard key={j} card={c} />
        ))}
      </Stack>
    ))}
  </Stack>
)
