import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Paper, Stack, Link as MuiLink, styled, Tab, Tabs, Typography, Container } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router'

import { ThemeSwitch } from '@/widgets/ThemeSwitch'
import { LoginForm } from '@/features/auth-by-email'
import { RegisterForm } from '@/features/register-by-email'
import { ROUTES } from '@/shared/config'

type AuthTab = 'login' | 'register'

const TITLE = 'Добро пожаловать'
const SUBTITLES: Record<AuthTab, string> = {
  login: 'Войдите в свой аккаунт',
  register: 'Создайте новый аккаунт',
}
const TAB_LABELS: Record<AuthTab, string> = {
  login: 'Вход',
  register: 'Регистрация',
}

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    flex: 1,
  },
}))

export const AuthSection = () => {
  const [tab, setTab] = useState<AuthTab>('login')

  return (
    <Root sx={{ px: { xs: 3, md: 0 }, py: { xs: 5, md: 0 } }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, display: { xs: 'none', md: 'block' } }}>
        <ThemeSwitch />
      </Box>

      <Container maxWidth='xs' disableGutters>
        <Box sx={{ pl: 2, mb: 2 }}>
          <MuiLink
            component={Link}
            to={ROUTES.landing}
            underline='hover'
            color='text.secondary'
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <ArrowBackIcon fontSize='small' />
            На главную
          </MuiLink>
        </Box>

        <Paper
          elevation={8}
          sx={{
            backgroundImage: 'none',
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant='h5'>{TITLE}</Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                {SUBTITLES[tab]}
              </Typography>
            </Stack>

            <Tabs
              value={tab}
              onChange={(_, value: AuthTab) => setTab(value)}
              variant='fullWidth'
              sx={{
                bgcolor: 'action.disabledBackground',
                borderRadius: 1,
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText' },
              }}
            >
              <Tab value='login' label={TAB_LABELS.login} />
              <Tab value='register' label={TAB_LABELS.register} />
            </Tabs>

            {tab === 'login' ? <LoginForm /> : <RegisterForm />}
          </Stack>
        </Paper>
      </Container>
    </Root>
  )
}
