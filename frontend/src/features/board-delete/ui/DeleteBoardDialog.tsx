import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import { type Board, useDeleteBoardMutation } from '@/entities/board'
import { getErrorKey } from '@/shared/api/errors'

interface Props {
  workspaceId: string
  board: Board | null
  onClose: () => void
}

export const DeleteBoardDialog = ({ workspaceId, board, onClose }: Props) => {
  const [deleteBoard, { isLoading }] = useDeleteBoardMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['board', 'errors'])

  const handleDelete = async () => {
    if (!board) return
    try {
      await deleteBoard({ workspaceId, boardId: board.id }).unwrap()
      onClose()
    } catch (err) {
      const key = getErrorKey(err, { fallback: 'errors.board.deleteFailed' })
      enqueueSnackbar(t(key), { variant: 'error' })
    }
  }

  return (
    <Dialog open={Boolean(board)} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle>{t('board.delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('board.delete.body', { name: board?.name ?? '' })}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant='outlined' disabled={isLoading}>
          {t('board.delete.cancel')}
        </Button>
        <Button onClick={handleDelete} color='error' variant='contained' disabled={isLoading}>
          {t('board.delete.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
