import { Container, Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { CreateWorkspaceDialog } from '@/features/workspace-create'
import { useGetWorkspacesQuery, WorkspaceCard } from '@/entities/workspace'
import { ROUTES } from '@/shared/config'

import { CreateWorkspaceCard, NoWorkspaces, WorkspaceGridSkeleton, WorkspacesError } from './ui'

const WorkspaceSelectionPage = () => {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: workspaces, isLoading, isError, refetch } = useGetWorkspacesQuery()
  const { t } = useTranslation('workspace')

  const openDialog = () => setDialogOpen(true)
  const closeDialog = () => setDialogOpen(false)

  const renderContent = () => {
    if (isLoading) {
      return <WorkspaceGridSkeleton />
    }

    if (isError) {
      return <WorkspacesError onRefreshClick={() => refetch()} />
    }

    if (!workspaces || workspaces.length === 0) {
      return <NoWorkspaces onButtonCreateClick={openDialog} />
    }

    return (
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <CreateWorkspaceCard onClick={openDialog} />
        </Grid>
        {workspaces.map((ws) => (
          <Grid key={ws.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <WorkspaceCard workspace={ws} onClick={() => navigate(ROUTES.workspace(ws.id))} />
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant='h4'>{t('workspace.list.title')}</Typography>
          <Typography variant='body1' sx={{ color: 'text.secondary' }}>
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
