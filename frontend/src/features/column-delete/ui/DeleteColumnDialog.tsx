import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import type { BoardColumn } from '@/entities/board'
import { useDeleteColumnMutation } from '@/entities/column'
import { getErrorKey } from '@/shared/api/errors'

interface Props {
  workspaceId: string
  boardId: string
  column: BoardColumn | null
  onClose: () => void
}

export const DeleteColumnDialog = ({ workspaceId, boardId, column, onClose }: Props) => {
  const [deleteColumn, { isLoading }] = useDeleteColumnMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['column', 'errors'])

  const handleDelete = async () => {
    if (!column) return
    try {
      await deleteColumn({ workspaceId, boardId, columnId: column.id }).unwrap()
      onClose()
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.column.deleteFailed' })), { variant: 'error' })
    }
  }

  return (
    <Dialog open={Boolean(column)} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle>{t('column.delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('column.delete.body', { name: column?.name ?? '' })}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant='outlined' disabled={isLoading}>
          {t('column.delete.cancel')}
        </Button>
        <Button onClick={handleDelete} color='error' variant='contained' disabled={isLoading}>
          {t('column.delete.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
