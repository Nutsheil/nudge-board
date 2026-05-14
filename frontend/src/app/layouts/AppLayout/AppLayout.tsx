import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { type MouseEvent, Suspense, useState } from 'react'
import { Outlet } from 'react-router'

import { useLogoutMutation } from '@/entities/session'

export const AppLayout = () => {
  const [logout] = useLogoutMutation()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const open = Boolean(anchorEl)
  const closeMenu = () => setAnchorEl(null)
  const openMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  const handleLogout = () => {
    closeMenu()
    void logout()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position='static' color='default' elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            NudgeBoard
          </Typography>
          <IconButton size='small' onClick={openMenu} aria-label='Меню пользователя'>
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={closeMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleLogout}>Выйти</MenuItem>
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
