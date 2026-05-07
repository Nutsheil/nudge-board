import BoltIcon from '@mui/icons-material/Bolt'
import { Box, Stack, Typography } from '@mui/material'
import type { TypographyProps } from '@mui/material'

type Preset = {
  box: number
  icon: number
  radius: number
  gap: number
  typography: TypographyProps['variant']
}

type Size = 'sm' | 'md' | 'lg'

const SIZE_PRESETS: Record<Size, Preset> = {
  sm: { box: 32, icon: 20, radius: 1, gap: 1, typography: 'h6' },
  md: { box: 46, icon: 28, radius: 1.5, gap: 1.75, typography: 'h4' },
  lg: { box: 64, icon: 40, radius: 2, gap: 2.25, typography: 'h3' },
} as const

type LogoVariant = 'icon' | 'full'

type Props = {
  size?: Size
  variant?: LogoVariant
}

export const Logo = (props: Props) => {
  const { size = 'md', variant = 'full' } = props

  const preset = SIZE_PRESETS[size]

  const icon = (
    <Box
      sx={{
        width: preset.box,
        height: preset.box,
        borderRadius: preset.radius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      }}
    >
      <BoltIcon sx={{ fontSize: preset.icon }} />
    </Box>
  )

  if (variant === 'icon') {
    return icon
  }

  return (
    <Stack direction='row' spacing={preset.gap} sx={{ alignItems: 'center' }}>
      {icon}
      <Typography variant={preset.typography}>NudgeBoard</Typography>
    </Stack>
  )
}
