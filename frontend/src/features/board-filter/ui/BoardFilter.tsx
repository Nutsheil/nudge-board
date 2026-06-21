import FilterListIcon from '@mui/icons-material/FilterList'
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Typography,
} from '@mui/material'
import { useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import type { Priority } from '@/entities/board'
import { LABEL_HEX, useGetLabelsQuery } from '@/entities/label'

import { EMPTY_FILTER, isFilterActive, type BoardFilterState } from '../model/filter'

const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

interface Props {
  workspaceId: string
  state: BoardFilterState
  onChange: (next: BoardFilterState) => void
}

export const BoardFilter = ({ workspaceId, state, onChange }: Props) => {
  const { t } = useTranslation(['board', 'task'])
  const { data: labels = [] } = useGetLabelsQuery(workspaceId)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const activeCount = state.labelIds.length + state.priorities.length

  const toggleLabel = (id: string) =>
    onChange({
      ...state,
      labelIds: state.labelIds.includes(id)
        ? state.labelIds.filter((x) => x !== id)
        : [...state.labelIds, id],
    })

  const togglePriority = (p: Priority) =>
    onChange({
      ...state,
      priorities: state.priorities.includes(p)
        ? state.priorities.filter((x) => x !== p)
        : [...state.priorities, p],
    })

  return (
    <Box>
      <Badge color='primary' badgeContent={activeCount} invisible={activeCount === 0}>
        <Button
          startIcon={<FilterListIcon />}
          onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
          color='inherit'
          sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
        >
          {t('board.filter.trigger')}
        </Button>
      </Badge>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: 260, py: 1 } } }}
      >
        <Typography variant='overline' sx={{ px: 2, color: 'text.secondary' }}>
          {t('board.filter.priority')}
        </Typography>
        {PRIORITIES.map((p) => (
          <ListItemButton key={p} dense onClick={() => togglePriority(p)}>
            <Checkbox edge='start' size='small' checked={state.priorities.includes(p)} tabIndex={-1} disableRipple />
            <ListItemText primary={t(`task.priority.${p}`)} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 0.5 }} />
        <Typography variant='overline' sx={{ px: 2, color: 'text.secondary' }}>
          {t('board.filter.labels')}
        </Typography>
        {labels.length === 0 ? (
          <Typography variant='body2' sx={{ px: 2, py: 0.5, color: 'text.secondary' }}>
            {t('board.filter.empty')}
          </Typography>
        ) : (
          labels.map((l) => (
            <ListItemButton key={l.id} dense onClick={() => toggleLabel(l.id)}>
              <Checkbox edge='start' size='small' checked={state.labelIds.includes(l.id)} tabIndex={-1} disableRipple />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: LABEL_HEX[l.color], mr: 1 }} />
              <ListItemText primary={l.name} />
            </ListItemButton>
          ))
        )}
        {isFilterActive(state) && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <Stack sx={{ px: 1 }}>
              <Button size='small' onClick={() => onChange(EMPTY_FILTER)} sx={{ color: 'text.secondary' }}>
                {t('board.filter.clear')}
              </Button>
            </Stack>
          </>
        )}
      </Popover>
    </Box>
  )
}
