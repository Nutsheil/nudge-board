import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import { boardSchema, type BoardFormValues, useCreateBoardMutation } from '@/entities/board'
import { getErrorKey } from '@/shared/api/errors'
import { createFormFields, ZodForm } from '@/shared/ui'

const { FormTextField } = createFormFields<BoardFormValues>()

interface Props {
  workspaceId: string
  open: boolean
  onClose: () => void
}

export const CreateBoardDialog = ({ workspaceId, open, onClose }: Props) => {
  const [createBoard, { isLoading }] = useCreateBoardMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['board', 'errors'])

  const handleSubmit = async (values: BoardFormValues) => {
    try {
      await createBoard({ workspaceId, ...values }).unwrap()
      onClose()
    } catch (err) {
      const key = getErrorKey(err, { fallback: 'errors.board.createFailed' })
      enqueueSnackbar(t(key), { variant: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <ZodForm schema={boardSchema} defaultValues={{ name: '', description: '' }} onSubmit={handleSubmit}>
        <DialogTitle>{t('board.create.title')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormTextField
              name='name'
              label={t('board.field.name.label')}
              placeholder={t('board.field.name.placeholder')}
              fullWidth
            />
            <FormTextField
              name='description'
              label={t('board.field.description.label')}
              placeholder={t('board.field.description.placeholder')}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant='outlined' disabled={isLoading}>
            {t('board.create.cancel')}
          </Button>
          <Button type='submit' variant='contained' disabled={isLoading}>
            {t('board.create.submit')}
          </Button>
        </DialogActions>
      </ZodForm>
    </Dialog>
  )
}
