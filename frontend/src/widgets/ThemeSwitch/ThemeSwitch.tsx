import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

import { useThemeMode } from '@/shared/config'

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.short,
    easing: theme.transitions.easing.easeOut,
  }),
  '&:hover': {
    transform: 'rotate(20deg)',
  },
  '&:active': {
    transform: 'rotate(180deg)',
  },
}))

export const ThemeSwitch = () => {
  const { palette, toggle } = useThemeMode()
  const { t } = useTranslation()
  const isDark = palette === 'dark'

  return (
    <AnimatedIconButton
      onClick={toggle}
      color='inherit'
      aria-pressed={isDark}
      aria-label={t(isDark ? 'common.themeSwitch.toLight' : 'common.themeSwitch.toDark', {
        defaultValue: isDark ? 'Switch to light theme' : 'Switch to dark theme',
      })}
    >
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </AnimatedIconButton>
  )
}
