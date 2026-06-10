import { Box, Stack, Typography } from '@mui/material'
import type { TypographyProps } from '@mui/material'

type Preset = {
  mark: number
  gap: number
  typography: TypographyProps['variant']
}

type Size = 'sm' | 'md' | 'lg'

const SIZE_PRESETS: Record<Size, Preset> = {
  sm: { mark: 28, gap: 1, typography: 'h6' },
  md: { mark: 40, gap: 1.75, typography: 'h4' },
  lg: { mark: 56, gap: 2.25, typography: 'h3' },
} as const

type LogoVariant = 'icon' | 'full'

type Props = {
  size?: Size
  variant?: LogoVariant
}

// "Nudge columns" mark: two graphite kanban columns plus a coral column nudged
// up a step (board + nudge + the One Signal accent). Flat and theme-aware — the
// graphite bars inherit currentColor (ink in light, white in dark), the accent
// bar is Signal Coral. The rising heights + lifted coral bar read as forward motion.
const Mark = ({ size }: { size: number }) => (
  <Box
    component='svg'
    viewBox='0 0 24 24'
    aria-hidden
    sx={(theme) => ({
      width: size,
      height: size,
      display: 'block',
      color: theme.palette.text.primary,
      '& .nudge-accent': { fill: theme.palette.primary.main },
    })}
  >
    <rect x='2.5' y='11' width='5' height='11' rx='1.6' fill='currentColor' opacity='0.45' />
    <rect x='9.5' y='7' width='5' height='15' rx='1.6' fill='currentColor' opacity='0.75' />
    <rect x='16.5' y='2' width='5' height='15' rx='1.6' className='nudge-accent' />
  </Box>
)

export const Logo = ({ size = 'md', variant = 'full' }: Props) => {
  const preset = SIZE_PRESETS[size]
  const mark = <Mark size={preset.mark} />

  if (variant === 'icon') {
    return mark
  }

  return (
    <Stack direction='row' spacing={preset.gap} sx={{ alignItems: 'center' }}>
      {mark}
      <Typography variant={preset.typography}>NudgeBoard</Typography>
    </Stack>
  )
}
