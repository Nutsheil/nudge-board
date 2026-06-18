import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material'
import { useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import type { BoardTask } from '@/entities/board'

interface Props {
  task: BoardTask
  onRename: () => void
  onDelete: () => void
}

export const TaskCard = ({ task, onRename, onDelete }: Props) => {
  const { t } = useTranslation('task')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const close = () => setAnchorEl(null)

  const openMenu = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', columnId: task.columnId },
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      variant='outlined'
      sx={{
        p: 1.25,
        bgcolor: 'background.paper',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        boxShadow: isDragging ? 8 : 0,
        '&:hover': { borderColor: 'text.disabled' },
        '&:hover .task-card-kebab, &:focus-within .task-card-kebab': { opacity: 1 },
        '@media (hover: none)': { '& .task-card-kebab': { opacity: 1 } },
      }}
      {...attributes}
      {...listeners}
    >
      <Stack direction='row' spacing={1} sx={{ alignItems: 'flex-start' }}>
        <Typography variant='body2' sx={{ flex: 1, wordBreak: 'break-word' }}>
          {task.title}
        </Typography>
        <IconButton
          className='task-card-kebab'
          size='small'
          aria-label={t('task.card.menu')}
          onClick={openMenu}
          sx={{
            mt: -0.5,
            mr: -0.5,
            color: 'text.secondary',
            opacity: open ? 1 : 0,
            transition: (theme) =>
              theme.transitions.create('opacity', { duration: theme.transitions.duration.shortest }),
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          }}
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
          {t('task.card.rename')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            close()
            onDelete()
          }}
          sx={{ color: 'error.main' }}
        >
          {t('task.card.delete')}
        </MenuItem>
      </Menu>
    </Paper>
  )
}
