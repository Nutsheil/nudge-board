import { Stack } from '@mui/material'

import { AuthSection, LogoSection } from './ui'

const AuthPage = () => {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} sx={{ minHeight: '100vh' }}>
      <LogoSection />
      <AuthSection />
    </Stack>
  )
}

export default AuthPage
