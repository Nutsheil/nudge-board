import { Alert, Box, Button, Container, Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { CreateWorkspaceDialog } from '@/features/workspace-create'
import { useGetWorkspacesQuery, WorkspaceCard } from '@/entities/workspace'
import { ROUTES } from '@/shared/config'

import { CreateWorkspaceCard, WorkspaceGridSkeleton } from './ui'

const WorkspaceSelectionPage = () => {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: workspaces, isLoading, isError, refetch } = useGetWorkspacesQuery()
  const { t } = useTranslation('workspace')

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
              {t('workspace.list.retry')}
            </Button>
          }
        >
          {t('workspace.list.loadError')}
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
            <Typography variant='h6'>{t('workspace.list.empty.title')}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {t('workspace.list.empty.subtitle')}
            </Typography>
            <Button variant='contained' onClick={openDialog}>
              {t('workspace.list.create')}
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
            {t('workspace.list.title')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t('workspace.list.subtitle')}
          </Typography>
        </Stack>

        {renderContent()}
      </Stack>

      <CreateWorkspaceDialog open={dialogOpen} onClose={closeDialog} />
    </Container>
  )
}

export default WorkspaceSelectionPage
