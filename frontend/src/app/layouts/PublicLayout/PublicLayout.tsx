import { Box, AppBar, Toolbar, Typography, Button, Stack } from '@mui/material'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router'

import { LanguageSwitch } from '@/widgets/LanguageSwitch'
import { ThemeSwitch } from '@/widgets/ThemeSwitch'
import { ROUTES } from '@/shared/config'

export const PublicLayout = () => {
  const { t } = useTranslation('common')

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

          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <LanguageSwitch />
            <ThemeSwitch />

            <Button component={Link} to={ROUTES.auth} variant='contained'>
              {t('common.login')}
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
