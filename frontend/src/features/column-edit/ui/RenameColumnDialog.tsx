import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import type { BoardColumn } from '@/entities/board'
import { columnSchema, type ColumnFormValues, useUpdateColumnMutation } from '@/entities/column'
import { getErrorKey } from '@/shared/api/errors'
import { createFormFields, ZodForm } from '@/shared/ui'

const { FormTextField } = createFormFields<ColumnFormValues>()

interface Props {
  workspaceId: string
  boardId: string
  column: BoardColumn | null
  onClose: () => void
}

export const RenameColumnDialog = ({ workspaceId, boardId, column, onClose }: Props) => {
  const [updateColumn, { isLoading }] = useUpdateColumnMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['column', 'errors'])

  const handleSubmit = async (values: ColumnFormValues) => {
    if (!column) return
    try {
      await updateColumn({ workspaceId, boardId, columnId: column.id, name: values.name }).unwrap()
      onClose()
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.column.updateFailed' })), { variant: 'error' })
    }
  }

  return (
    <Dialog open={Boolean(column)} onClose={onClose} fullWidth maxWidth='xs'>
      {column && (
        <ZodForm schema={columnSchema} defaultValues={{ name: column.name }} onSubmit={handleSubmit}>
          <DialogTitle>{t('column.rename.title')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <FormTextField name='name' label={t('column.field.name.label')} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} variant='outlined' disabled={isLoading}>
              {t('column.rename.cancel')}
            </Button>
            <Button type='submit' variant='contained' disabled={isLoading}>
              {t('column.rename.submit')}
            </Button>
          </DialogActions>
        </ZodForm>
      )}
    </Dialog>
  )
}
