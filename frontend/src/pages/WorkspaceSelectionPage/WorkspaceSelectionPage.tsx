import { Alert, Box, Button, Container, Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { CreateWorkspaceDialog } from '@/features/workspace-create'
import { useGetWorkspacesQuery, WorkspaceCard } from '@/entities/workspace'
import { ROUTES } from '@/shared/config'

import { CreateWorkspaceCard, WorkspaceGridSkeleton } from './ui'

const WorkspaceSelectionPage = () => {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: workspaces, isLoading, isError, refetch } = useGetWorkspacesQuery()

  const openDialog = () => setDialogOpen(true)
  const closeDialog = () => setDialogOpen(false)

  const renderContent = () => {
    if (isLoading) return <WorkspaceGridSkeleton />

    if (isError) {
      return (
        <Alert
          severity='error'
          action={
            <Button color='inherit' size='small' onClick={() => void refetch()}>
              Повторить
            </Button>
          }
        >
          Не удалось загрузить список пространств.
        </Alert>
      )
    }

    if (!workspaces || workspaces.length === 0) {
      return (
        <Box
          sx={{
            border: 1,
            borderStyle: 'dashed',
            borderColor: 'divider',
            borderRadius: 2,
            py: 8,
            px: 3,
            textAlign: 'center',
          }}
        >
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant='h6'>У вас пока нет пространств</Typography>
            <Typography variant='body2' color='text.secondary'>
              Создайте первое, чтобы начать работу с досками и задачами.
            </Typography>
            <Button variant='contained' onClick={openDialog}>
              Создать пространство
            </Button>
          </Stack>
        </Box>
      )
    }

    return (
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <CreateWorkspaceCard onClick={openDialog} />
        </Grid>
        {workspaces.map((ws) => (
          <Grid key={ws.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <WorkspaceCard workspace={ws} onClick={() => void navigate(ROUTES.workspace(ws.id))} />
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant='h4' sx={{ fontWeight: 700 }}>
            Ваши пространства
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Выберите пространство, чтобы продолжить, или создайте новое.
          </Typography>
        </Stack>

        {renderContent()}
      </Stack>

      <CreateWorkspaceDialog open={dialogOpen} onClose={closeDialog} />
    </Container>
  )
}

export default WorkspaceSelectionPage
