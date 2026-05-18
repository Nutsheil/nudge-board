import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Stack, Toolbar } from '@mui/material'
import { type MouseEvent, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'

import { LanguageSwitch } from '@/widgets/LanguageSwitch'
import { ThemeSwitch } from '@/widgets/ThemeSwitch'
import { useLogoutMutation } from '@/entities/session'
import { Logo } from '@/shared/ui'

export const AppLayout = () => {
  const [logout] = useLogoutMutation()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { t } = useTranslation('common')

  const open = Boolean(anchorEl)
  const closeMenu = () => setAnchorEl(null)
  const openMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  const handleLogout = () => {
    closeMenu()
    logout()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position='static' color='default' elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Logo size='sm' />
          <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
            <LanguageSwitch />
            <ThemeSwitch />
            <IconButton size='small' onClick={openMenu} aria-label={t('common.userMenu.aria')}>
              <Avatar sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Stack>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={closeMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleLogout}>{t('common.logout')}</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component='main' sx={{ flex: 1 }}>
        <Suspense fallback={<></>}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  )
}
