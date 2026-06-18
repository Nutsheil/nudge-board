import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, IconButton, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material'
import { useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import type { BoardColumn } from '@/entities/board'

interface Props {
  column: BoardColumn
  onRename: () => void
  onDelete: () => void
}

export const Column = ({ column, onRename, onDelete }: Props) => {
  const { t } = useTranslation('column')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const close = () => setAnchorEl(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

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
      {/* Task cards arrive in Slice 3 */}
      <Box sx={{ minHeight: 120 }} />
    </Paper>
  )
}
