import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Suspense } from 'react'
import { Link, Outlet } from 'react-router'

export const PublicLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position='static' color='default' elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            component={Link}
            to='/'
            variant='h6'
            sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}
          >
            NudgeBoard
          </Typography>
          <Button component={Link} to='/auth' variant='contained'>
            Войти
          </Button>
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
