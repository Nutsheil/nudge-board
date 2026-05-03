import { Box, AppBar, Toolbar, Typography, Button, Stack } from '@mui/material'
import { Suspense } from 'react'
import { Link, Outlet } from 'react-router'

import { ThemeSwitch } from '@/widgets/ThemeSwitch'
import { ROUTES } from '@/shared/config'

export const PublicLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position='static' color='default' elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            component={Link}
            to={ROUTES.landing}
            variant='h6'
            sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}
          >
            NudgeBoard
          </Typography>

          <Stack direction='row' spacing={2}>
            <ThemeSwitch />

            <Button component={Link} to={ROUTES.auth} variant='contained'>
              Log In
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component='main' sx={{ flex: 1, overflowY: 'auto' }}>
        <Suspense fallback={<></>}>
          <Outlet />
        </Suspense>

        <Box component='footer' sx={{ py: 2, textAlign: 'center' }}>
          <Typography variant='body2' color='textSecondary'>
            © {new Date().getFullYear()} NudgeBoard
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
