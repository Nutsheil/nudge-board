import { Container, Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { CreateBoardDialog } from '@/features/board-create'
import { DeleteBoardDialog } from '@/features/board-delete'
import { RenameBoardDialog } from '@/features/board-edit'
import { type Board, BoardCard, useGetBoardsQuery } from '@/entities/board'

import { BoardGridSkeleton, BoardsError, CreateBoardCard, NoBoards } from './ui'

const WorkspacePage = () => {
  const { workspaceId = '' } = useParams<{ workspaceId: string }>()
  const { t } = useTranslation('board')
  const { data: boards, isLoading, isError, refetch } = useGetBoardsQuery(workspaceId)

  const [createOpen, setCreateOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<Board | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Board | null>(null)

  const renderContent = () => {
    if (isLoading) return <BoardGridSkeleton />
    if (isError) return <BoardsError onRetryClick={() => refetch()} />
    if (!boards || boards.length === 0) return <NoBoards onCreateClick={() => setCreateOpen(true)} />

    return (
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <CreateBoardCard onClick={() => setCreateOpen(true)} />
        </Grid>
        {boards.map((board) => (
          <Grid key={board.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <BoardCard board={board} onRename={() => setRenameTarget(board)} onDelete={() => setDeleteTarget(board)} />
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant='h4'>{t('board.list.title')}</Typography>
          <Typography variant='body1' sx={{ color: 'text.secondary' }}>
            {t('board.list.subtitle')}
          </Typography>
        </Stack>
        {renderContent()}
      </Stack>

      <CreateBoardDialog workspaceId={workspaceId} open={createOpen} onClose={() => setCreateOpen(false)} />
      <RenameBoardDialog workspaceId={workspaceId} board={renameTarget} onClose={() => setRenameTarget(null)} />
      <DeleteBoardDialog workspaceId={workspaceId} board={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </Container>
  )
}

export default WorkspacePage
