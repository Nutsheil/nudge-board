import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'

import { useCreateWorkspaceMutation } from '@/entities/workspace'
import { isFetchError } from '@/shared/api/errors'
import { createFormFields, ZodForm } from '@/shared/ui'

import { createWorkspaceSchema, type CreateWorkspaceValues } from '../model/schema'

const { FormTextField } = createFormFields<CreateWorkspaceValues>()

const getCreateErrorMessage = (err: unknown): string => {
  if (isFetchError(err)) {
    if (err.status === 'FETCH_ERROR') return 'Нет соединения с сервером. Проверьте интернет.'
    if (typeof err.status === 'number' && err.status >= 500) return 'Сервер недоступен. Попробуйте позже.'
  }
  return 'Не удалось создать пространство. Попробуйте ещё раз.'
}

interface Props {
  open: boolean
  onClose: () => void
}

export const CreateWorkspaceDialog = ({ open, onClose }: Props) => {
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation()
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = async (values: CreateWorkspaceValues) => {
    try {
      await createWorkspace({
        name: values.name,
        description: values.description?.length ? values.description : undefined,
      }).unwrap()
      onClose()
    } catch (err) {
      enqueueSnackbar(getCreateErrorMessage(err), { variant: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <ZodForm
        schema={createWorkspaceSchema}
        defaultValues={{ name: '', description: '' }}
        onSubmit={handleSubmit}
      >
        <DialogTitle>Новое пространство</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormTextField name='name' label='Название' placeholder='Например, Acme Team' fullWidth autoFocus />
            <FormTextField
              name='description'
              label='Описание'
              placeholder='Зачем это пространство (необязательно)'
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button type='submit' variant='contained' disabled={isLoading}>
            Создать
          </Button>
        </DialogActions>
      </ZodForm>
    </Dialog>
  )
}
