import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import type { BoardTask } from '@/entities/board'
import { taskSchema, type TaskFormValues, useUpdateTaskMutation } from '@/entities/task'
import { getErrorKey } from '@/shared/api/errors'
import { createFormFields, ZodForm } from '@/shared/ui'

const { FormTextField } = createFormFields<TaskFormValues>()

interface Props {
  workspaceId: string
  boardId: string
  task: BoardTask | null
  onClose: () => void
}

export const RenameTaskDialog = ({ workspaceId, boardId, task, onClose }: Props) => {
  const [updateTask, { isLoading }] = useUpdateTaskMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['task', 'errors'])

  const handleSubmit = async (values: TaskFormValues) => {
    if (!task) return
    try {
      await updateTask({ workspaceId, boardId, taskId: task.id, patch: { title: values.title } }).unwrap()
      onClose()
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.task.updateFailed' })), { variant: 'error' })
    }
  }

  return (
    <Dialog open={Boolean(task)} onClose={onClose} fullWidth maxWidth='xs'>
      {task && (
        <ZodForm schema={taskSchema} defaultValues={{ title: task.title }} onSubmit={handleSubmit}>
          <DialogTitle>{t('task.rename.title')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <FormTextField name='title' label={t('task.field.title.label')} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} variant='outlined' disabled={isLoading}>
              {t('task.rename.cancel')}
            </Button>
            <Button type='submit' variant='contained' disabled={isLoading}>
              {t('task.rename.submit')}
            </Button>
          </DialogActions>
        </ZodForm>
      )}
    </Dialog>
  )
}
