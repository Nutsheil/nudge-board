import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router'

import { ROUTES } from '@/shared/config'

const WorkspacePage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const navigate = useNavigate()

  return (
    <Container maxWidth='md' sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant='overline' sx={{ color: 'text.secondary' }}>
            Workspace
          </Typography>
          <Typography variant='h4' sx={{ wordBreak: 'break-all' }}>
            {workspaceId}
          </Typography>
        </Box>
        <Typography variant='body1' sx={{ color: 'text.secondary' }}>
          Здесь скоро появятся доски и задачи этого пространства.
        </Typography>
        <Box>
          <Button variant='outlined' onClick={() => navigate(ROUTES.app)}>
            К списку пространств
          </Button>
        </Box>
      </Stack>
    </Container>
  )
}

export default WorkspacePage
