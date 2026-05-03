import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'

import { useThemeMode } from '@/shared/config'

const AnimatedIconButton = styled(IconButton)({
  transition: 'transform 0.4s ease',
  '&:hover': {
    transform: 'rotate(20deg)',
  },
  '&:active': {
    transform: 'rotate(180deg)',
  },
})

export const ThemeSwitch = () => {
  const { palette, toggle } = useThemeMode()
  const isDark = palette === 'dark'

  return (
    <AnimatedIconButton onClick={toggle} color='inherit'>
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </AnimatedIconButton>
  )
}
