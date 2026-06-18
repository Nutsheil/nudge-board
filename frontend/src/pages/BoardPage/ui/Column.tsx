import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, IconButton, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material'
import { useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { CreateTaskInline } from '@/features/task-create'
import type { BoardColumn, BoardTask } from '@/entities/board'

import { TaskCard } from './TaskCard'

interface Props {
  workspaceId: string
  boardId: string
  column: BoardColumn
  onRename: () => void
  onDelete: () => void
  onRenameTask: (task: BoardTask) => void
  onDeleteTask: (task: BoardTask) => void
}

export const Column = ({ workspaceId, boardId, column, onRename, onDelete, onRenameTask, onDeleteTask }: Props) => {
  const { t } = useTranslation('column')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const close = () => setAnchorEl(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { type: 'column' },
  })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  const { setNodeRef: setTaskDropRef } = useDroppable({
    id: `tasks:${column.id}`,
    data: { type: 'column-drop', columnId: column.id },
  })

  return (
    <Paper ref={setNodeRef} style={style} variant='outlined' sx={{ width: 288, flexShrink: 0, p: 1.5, bgcolor: 'surface.cardDeep' }}>
      <Stack direction='row' spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
        <IconButton
          size='small'
          aria-label={t('column.card.dragHandle')}
          sx={{ cursor: 'grab', touchAction: 'none', color: 'text.secondary' }}
          {...attributes}
          {...listeners}
        >
          <DragIndicatorIcon fontSize='small' />
        </IconButton>
        <Typography variant='subtitle1' sx={{ fontWeight: 600, wordBreak: 'break-word', flex: 1 }}>
          {column.name}
        </Typography>
        <IconButton
          size='small'
          aria-label={t('column.card.menu')}
          onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
        >
          <MoreVertIcon fontSize='small' />
        </IconButton>
      </Stack>
      <Menu anchorEl={anchorEl} open={open} onClose={close}>
        <MenuItem
          onClick={() => {
            close()
            onRename()
          }}
        >
          {t('column.card.rename')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            close()
            onDelete()
          }}
          sx={{ color: 'error.main' }}
        >
          {t('column.card.delete')}
        </MenuItem>
      </Menu>
      <Box ref={setTaskDropRef} sx={{ minHeight: 8 }}>
        <SortableContext
          items={column.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={1}>
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onRename={() => onRenameTask(task)}
                onDelete={() => onDeleteTask(task)}
              />
            ))}
          </Stack>
        </SortableContext>
        {column.tasks.length === 0 && (
          <Box
            aria-hidden
            sx={{ minHeight: 52, borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}
          />
        )}
      </Box>
      <Box sx={{ mt: 1 }}>
        <CreateTaskInline workspaceId={workspaceId} boardId={boardId} columnId={column.id} />
      </Box>
    </Paper>
  )
}
