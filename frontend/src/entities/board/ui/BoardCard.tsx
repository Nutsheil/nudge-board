import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Card, CardActionArea, CardContent, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import type { Board } from '../model/types'

interface Props {
  board: Board
  onOpen: () => void
  onRename: () => void
  onDelete: () => void
}

export const BoardCard = ({ board, onOpen, onRename, onDelete }: Props) => {
  const { t } = useTranslation('board')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const close = () => setAnchorEl(null)
  const openMenu = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
  }

  return (
    <Card variant='outlined' sx={{ height: '100%', position: 'relative' }}>
      <IconButton
        size='small'
        aria-label={t('board.card.menu')}
        onClick={openMenu}
        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
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
      <CardActionArea onClick={onOpen} sx={{ height: '100%' }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, pr: 5 }}>
          <Typography variant='h6' sx={{ wordBreak: 'break-word' }}>
            {board.name}
          </Typography>
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
      </CardActionArea>
    </Card>
  )
}
