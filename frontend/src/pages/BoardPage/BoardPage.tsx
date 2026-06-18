import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button, Container, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import { CreateColumnInline } from '@/features/column-create'
import { DeleteColumnDialog } from '@/features/column-delete'
import { RenameColumnDialog } from '@/features/column-edit'
import { type BoardColumn, useGetBoardQuery } from '@/entities/board'
import { useMoveColumnMutation } from '@/entities/column'
import { getErrorKey } from '@/shared/api/errors'
import { ROUTES } from '@/shared/config'

import { BoardError, Column, ColumnsSkeleton } from './ui'

const BoardPage = () => {
  const { workspaceId = '', boardId = '' } = useParams<{ workspaceId: string; boardId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation(['column', 'errors'])
  const { data: board, isLoading, isError, refetch } = useGetBoardQuery({ workspaceId, boardId })

  const [renameTarget, setRenameTarget] = useState<BoardColumn | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BoardColumn | null>(null)

  const [moveColumn] = useMoveColumnMutation()
  const { enqueueSnackbar } = useSnackbar()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !board) return

    const ids = board.columns.map((c) => c.id)
    const oldIndex = ids.indexOf(active.id as string)
    const newIndex = ids.indexOf(over.id as string)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(ids, oldIndex, newIndex)
    const movedAt = reordered.indexOf(active.id as string)
    const afterId = movedAt === 0 ? null : reordered[movedAt - 1]

    try {
      await moveColumn({ workspaceId, boardId, columnId: active.id as string, afterId }).unwrap()
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.column.moveFailed' })), { variant: 'error' })
    }
  }

  const renderContent = () => {
    if (isLoading) return <ColumnsSkeleton />
    if (isError || !board) return <BoardError onRetryClick={() => refetch()} />

    return (
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={board.columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
          <Stack direction='row' spacing={2} sx={{ overflowX: 'auto', alignItems: 'flex-start', pb: 2 }}>
            {board.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onRename={() => setRenameTarget(column)}
                onDelete={() => setDeleteTarget(column)}
              />
            ))}
            <CreateColumnInline workspaceId={workspaceId} boardId={boardId} />
          </Stack>
        </SortableContext>
      </DndContext>
    )
  }

  return (
    <Container maxWidth={false} sx={{ py: { xs: 3, md: 4 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTES.workspace(workspaceId))}
            color='inherit'
            sx={{ alignSelf: 'flex-start', color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
          >
            {t('column.board.back')}
          </Button>
          <Typography variant='h4'>{board?.name ?? ''}</Typography>
        </Stack>
        {renderContent()}
      </Stack>
      <RenameColumnDialog
        workspaceId={workspaceId}
        boardId={boardId}
        column={renameTarget}
        onClose={() => setRenameTarget(null)}
      />
      <DeleteColumnDialog
        workspaceId={workspaceId}
        boardId={boardId}
        column={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </Container>
  )
}

export default BoardPage
