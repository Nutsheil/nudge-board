import { closestCorners, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button, Container, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import { BoardFilter, EMPTY_FILTER, matchesFilter, type BoardFilterState } from '@/features/board-filter'
import { CreateColumnInline } from '@/features/column-create'
import { DeleteColumnDialog } from '@/features/column-delete'
import { RenameColumnDialog } from '@/features/column-edit'
import { DeleteTaskDialog } from '@/features/task-delete'
import { RenameTaskDialog } from '@/features/task-edit'
import { type BoardColumn, type BoardTask, useGetBoardQuery } from '@/entities/board'
import { useMoveColumnMutation } from '@/entities/column'
import { useMoveTaskMutation } from '@/entities/task'
import { getErrorKey } from '@/shared/api/errors'
import { ROUTES } from '@/shared/config'

import { BoardError, Column, ColumnsSkeleton } from './ui'

const BoardPage = () => {
  const { workspaceId = '', boardId = '' } = useParams<{ workspaceId: string; boardId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation(['column', 'board', 'errors'])
  const { data: board, isLoading, isError, refetch } = useGetBoardQuery({ workspaceId, boardId })

  const [filter, setFilter] = useState<BoardFilterState>(EMPTY_FILTER)
  const [renameTarget, setRenameTarget] = useState<BoardColumn | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BoardColumn | null>(null)
  const [renameTaskTarget, setRenameTaskTarget] = useState<BoardTask | null>(null)
  const [deleteTaskTarget, setDeleteTaskTarget] = useState<BoardTask | null>(null)

  const [moveColumn] = useMoveColumnMutation()
  const [moveTask] = useMoveTaskMutation()
  const { enqueueSnackbar } = useSnackbar()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleColumnDragEnd = async (active: DragEndEvent['active'], over: DragEndEvent['over']) => {
    if (!over || !board) return
    const overData = over.data.current
    const overColumnId =
      overData?.type === 'column' ? (over.id as string) : (overData?.columnId as string | undefined)
    if (!overColumnId || active.id === overColumnId) return

    const ids = board.columns.map((c) => c.id)
    const oldIndex = ids.indexOf(active.id as string)
    const newIndex = ids.indexOf(overColumnId)
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

  const handleTaskDragEnd = async (active: DragEndEvent['active'], over: DragEndEvent['over']) => {
    if (!over || !board) return
    const activeId = active.id as string
    const sourceColumnId = active.data.current?.columnId as string | undefined
    const overData = over.data.current

    // Resolve the target column and (optionally) the task we dropped onto.
    let targetColumnId: string | undefined
    let overTaskId: string | null = null
    if (overData?.type === 'task') {
      targetColumnId = overData.columnId as string
      overTaskId = over.id as string
    } else if (overData?.type === 'column') {
      targetColumnId = over.id as string
    } else if (overData?.type === 'column-drop') {
      targetColumnId = overData.columnId as string
    }
    if (!targetColumnId) return

    const targetColumn = board.columns.find((c) => c.id === targetColumnId)
    if (!targetColumn) return

    const targetIds = targetColumn.tasks.map((t) => t.id)

    let newOrder: string[]
    if (targetColumnId === sourceColumnId) {
      // Same column: reorder with arrayMove so a downward drop lands after the
      // over-task and an upward drop lands before it (directional, like columns).
      const oldIndex = targetIds.indexOf(activeId)
      const newIndex = overTaskId === null ? targetIds.length - 1 : targetIds.indexOf(overTaskId)
      if (oldIndex === -1 || newIndex === -1) return
      newOrder = arrayMove(targetIds, oldIndex, newIndex)
    } else {
      // Cross column: insert before the over-task, or append on a column drop.
      const insertIndex = overTaskId === null ? targetIds.length : Math.max(0, targetIds.indexOf(overTaskId))
      newOrder = [...targetIds.slice(0, insertIndex), activeId, ...targetIds.slice(insertIndex)]
    }

    const movedAt = newOrder.indexOf(activeId)
    const afterId = movedAt <= 0 ? null : newOrder[movedAt - 1]

    // No-op: same column and the task already sits after the same anchor.
    if (targetColumnId === sourceColumnId) {
      const currentIndex = targetIds.indexOf(activeId)
      const currentAfterId = currentIndex <= 0 ? null : targetIds[currentIndex - 1]
      if (currentAfterId === afterId) return
    }

    try {
      await moveTask({ workspaceId, boardId, taskId: activeId, targetColumnId, afterId }).unwrap()
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.task.moveFailed' })), { variant: 'error' })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const type = active.data.current?.type
    if (type === 'column') {
      void handleColumnDragEnd(active, over)
    } else if (type === 'task') {
      void handleTaskDragEnd(active, over)
    }
  }

  const renderContent = () => {
    if (isLoading) return <ColumnsSkeleton />
    if (isError || !board) return <BoardError onRetryClick={() => refetch()} />

    return (
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SortableContext items={board.columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
          <Stack direction='row' spacing={2} sx={{ overflowX: 'auto', alignItems: 'flex-start', pb: 2 }}>
            {board.columns.map((column) => (
              <Column
                key={column.id}
                workspaceId={workspaceId}
                boardId={boardId}
                column={{ ...column, tasks: column.tasks.filter((task) => matchesFilter(task, filter)) }}
                onRename={() => setRenameTarget(column)}
                onDelete={() => setDeleteTarget(column)}
                onRenameTask={setRenameTaskTarget}
                onDeleteTask={setDeleteTaskTarget}
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
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='h4'>{board?.name ?? ''}</Typography>
            <BoardFilter workspaceId={workspaceId} state={filter} onChange={setFilter} />
          </Stack>
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
      <RenameTaskDialog
        workspaceId={workspaceId}
        boardId={boardId}
        task={renameTaskTarget}
        onClose={() => setRenameTaskTarget(null)}
      />
      <DeleteTaskDialog
        workspaceId={workspaceId}
        boardId={boardId}
        task={deleteTaskTarget}
        onClose={() => setDeleteTaskTarget(null)}
      />
    </Container>
  )
}

export default BoardPage
