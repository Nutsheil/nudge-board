import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import { type Board, boardSchema, type BoardFormValues, useUpdateBoardMutation } from '@/entities/board'
import { getErrorKey } from '@/shared/api/errors'
import { createFormFields, ZodForm } from '@/shared/ui'

const { FormTextField } = createFormFields<BoardFormValues>()

interface Props {
  workspaceId: string
  board: Board | null
  onClose: () => void
}

export const RenameBoardDialog = ({ workspaceId, board, onClose }: Props) => {
  const [updateBoard, { isLoading }] = useUpdateBoardMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['board', 'errors'])

  const handleSubmit = async (values: BoardFormValues) => {
    if (!board) return
    try {
      await updateBoard({ workspaceId, boardId: board.id, ...values }).unwrap()
      onClose()
    } catch (err) {
      const key = getErrorKey(err, { fallback: 'errors.board.updateFailed' })
      enqueueSnackbar(t(key), { variant: 'error' })
    }
  }

  return (
    <Dialog open={Boolean(board)} onClose={onClose} fullWidth maxWidth='sm'>
      {board && (
        <ZodForm
          schema={boardSchema}
          defaultValues={{ name: board.name, description: board.description ?? '' }}
          onSubmit={handleSubmit}
        >
          <DialogTitle>{t('board.rename.title')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <FormTextField name='name' label={t('board.field.name.label')} fullWidth />
              <FormTextField
                name='description'
                label={t('board.field.description.label')}
                fullWidth
                multiline
                minRows={3}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} variant='outlined' disabled={isLoading}>
              {t('board.rename.cancel')}
            </Button>
            <Button type='submit' variant='contained' disabled={isLoading}>
              {t('board.rename.submit')}
            </Button>
          </DialogActions>
        </ZodForm>
      )}
    </Dialog>
  )
}
