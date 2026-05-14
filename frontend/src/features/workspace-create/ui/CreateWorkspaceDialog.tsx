import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import { useCreateWorkspaceMutation } from '@/entities/workspace'
import { getErrorKey } from '@/shared/api/errors'
import { createFormFields, ZodForm } from '@/shared/ui'

import { createWorkspaceSchema, type CreateWorkspaceValues } from '../model/schema'

const { FormTextField } = createFormFields<CreateWorkspaceValues>()

interface Props {
  open: boolean
  onClose: () => void
}

export const CreateWorkspaceDialog = ({ open, onClose }: Props) => {
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['workspace', 'errors'])

  const handleSubmit = async (values: CreateWorkspaceValues) => {
    try {
      await createWorkspace({
        name: values.name,
        description: values.description?.length ? values.description : undefined,
      }).unwrap()
      onClose()
    } catch (err) {
      const key = getErrorKey(err, { fallback: 'errors.workspace.createFailed' })
      enqueueSnackbar(t(key), { variant: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <ZodForm
        schema={createWorkspaceSchema}
        defaultValues={{ name: '', description: '' }}
        onSubmit={handleSubmit}
      >
        <DialogTitle>{t('workspace.create.title')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormTextField
              name='name'
              label={t('workspace.create.field.name.label')}
              placeholder={t('workspace.create.field.name.placeholder')}
              fullWidth
              autoFocus
            />
            <FormTextField
              name='description'
              label={t('workspace.create.field.description.label')}
              placeholder={t('workspace.create.field.description.placeholder')}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            {t('workspace.create.cancel')}
          </Button>
          <Button type='submit' variant='contained' disabled={isLoading}>
            {t('workspace.create.submit')}
          </Button>
        </DialogActions>
      </ZodForm>
    </Dialog>
  )
}
