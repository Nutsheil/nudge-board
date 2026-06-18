import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import type { BoardTask } from '@/entities/board'
import { useDeleteTaskMutation } from '@/entities/task'
import { getErrorKey } from '@/shared/api/errors'

interface Props {
  workspaceId: string
  boardId: string
  task: BoardTask | null
  onClose: () => void
}

export const DeleteTaskDialog = ({ workspaceId, boardId, task, onClose }: Props) => {
  const [deleteTask, { isLoading }] = useDeleteTaskMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['task', 'errors'])

  const handleDelete = async () => {
    if (!task) return
    try {
      await deleteTask({ workspaceId, boardId, taskId: task.id }).unwrap()
      onClose()
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.task.deleteFailed' })), { variant: 'error' })
    }
  }

  return (
    <Dialog open={Boolean(task)} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle>{t('task.delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('task.delete.body', { title: task?.title ?? '' })}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant='outlined' disabled={isLoading}>
          {t('task.delete.cancel')}
        </Button>
        <Button onClick={handleDelete} color='error' variant='contained' disabled={isLoading}>
          {t('task.delete.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
