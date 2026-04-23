import { Box, Container, Paper, Link as MuiLink } from '@mui/material'
import { Suspense } from 'react'
import { Link, Outlet } from 'react-router'

export const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth='xs' disableGutters>
        <Box sx={{ mb: 2 }}>
          <MuiLink component={Link} to='/' underline='hover' color='text.secondary'>
            ← На главную
          </MuiLink>
        </Box>

        <Paper sx={{ p: 4 }} elevation={2}>
          <Suspense fallback={<></>}>
            <Outlet />
          </Suspense>
        </Paper>
      </Container>
    </Box>
  )
}
