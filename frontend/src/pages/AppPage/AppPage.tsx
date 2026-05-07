import { Box, Button } from '@mui/material'

import { useLogoutMutation } from '@/entities/session'

const AppPage = () => {
  const [logout] = useLogoutMutation()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10 }}>
      <Button onClick={() => logout()} size='extraLarge' variant='contained'>
        Logout
      </Button>
    </Box>
  )
}

export default AppPage
