import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Card, CardContent, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Board } from '../model/types'

interface Props {
  board: Board
  onRename: () => void
  onDelete: () => void
}

export const BoardCard = ({ board, onRename, onDelete }: Props) => {
  const { t } = useTranslation('board')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const close = () => setAnchorEl(null)

  return (
    <Card variant='outlined' sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction='row' spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant='h6' sx={{ wordBreak: 'break-word' }}>
            {board.name}
          </Typography>
          <IconButton
            size='small'
            aria-label={t('board.card.menu')}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon fontSize='small' />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={close}>
            <MenuItem
              onClick={() => {
                close()
                onRename()
              }}
            >
              {t('board.card.rename')}
            </MenuItem>
            <MenuItem
              onClick={() => {
                close()
                onDelete()
              }}
              sx={{ color: 'error.main' }}
            >
              {t('board.card.delete')}
            </MenuItem>
          </Menu>
        </Stack>
        <Typography
          variant='body2'
          sx={{
            color: 'text.secondary',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {board.description ?? t('board.card.noDescription')}
        </Typography>
      </CardContent>
    </Card>
  )
}
