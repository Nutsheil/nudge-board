import { Box, Stack, styled, Typography } from '@mui/material'

import { ThemeSwitch } from '@/widgets/ThemeSwitch'
import { Logo } from '@/shared/ui'

const FEATURES = ['Совместная работа в команде', 'Аналитика продуктивности', 'Удобный интерфейс']
const TITLE = 'Управляй задачами умнее'
const SUBTITLE = 'Организуй. Выбери приоритет. Выполни. Двигайся вперед'

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  minHeight: 220,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(180deg, ${theme.palette.surface.heroGradientStart} 0%, ${theme.palette.surface.heroGradientMid} 55%, ${theme.palette.surface.heroGradientEnd} 100%)`,
  [theme.breakpoints.up('md')]: {
    flex: 1,
    minHeight: 'auto',
  },
}))

const Flashlight1 = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -90,
  right: -120,
  width: 480,
  height: 480,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.dark,
  opacity: 0.18,
  filter: 'blur(80px)',
  pointerEvents: 'none',
}))

const Flashlight2 = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: -160,
  left: -130,
  width: 380,
  height: 380,
  borderRadius: '50%',
  backgroundColor: theme.palette.secondary.dark,
  opacity: 0.22,
  filter: 'blur(64px)',
  pointerEvents: 'none',
}))

export const LogoSection = () => {
  return (
    <Root>
      <Box sx={{ position: 'absolute', top: 16, right: 16, display: { md: 'none' } }}>
        <ThemeSwitch />
      </Box>

      <Flashlight1 aria-hidden />
      <Flashlight2 aria-hidden />

      <Stack spacing={{ xs: 2, md: 3.5 }} sx={{ alignItems: 'center' }}>
        <Logo size='md' />

        <Typography variant='subtitle1' sx={{ color: 'secondary.light' }}>
          {TITLE}
        </Typography>

        <Typography variant='body2' sx={{ display: { xs: 'none', md: 'block' }, color: 'textExtra.tertiary' }}>
          {SUBTITLE}
        </Typography>

        <Stack spacing={1.75} sx={{ display: { xs: 'none', md: 'flex' }, alignSelf: 'flex-start', pl: 2 }}>
          {FEATURES.map((feature) => (
            <Stack key={feature} direction='row' spacing={1.5} sx={{ alignItems: 'center' }}>
              <Typography variant='body2' sx={{ color: 'secondary.main' }}>
                ✦
              </Typography>
              <Typography variant='body2' sx={{ color: 'secondary.light' }}>
                {feature}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Root>
  )
}
