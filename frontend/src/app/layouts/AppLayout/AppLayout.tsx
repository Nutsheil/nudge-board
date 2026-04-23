import { Box, AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material'
import { Suspense } from 'react'
import { Outlet } from 'react-router'

export const AppLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position='static' color='default' elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            NudgeBoard
          </Typography>
          <IconButton size='small'>
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>
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
