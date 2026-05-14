import { Button, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import type { UseFormSetError } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRegisterMutation } from '@/entities/session'
import { getErrorKey, isFetchError } from '@/shared/api/errors'
import { ZodForm, createFormFields } from '@/shared/ui'

import { registerSchema, type RegisterValues } from '../model/schema'

const { FormTextField, FormPasswordField } = createFormFields<RegisterValues>()

export const RegisterForm = () => {
  const [register, { isLoading }] = useRegisterMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['auth', 'errors'])

  const handleSubmit = async (values: RegisterValues, methods: { setError: UseFormSetError<RegisterValues> }) => {
    const { name, email, password } = values
    try {
      await register({ name, email, password }).unwrap()
    } catch (err) {
      if (isFetchError(err) && err.status === 409) {
        methods.setError('email', { type: 'server', message: 'errors.auth.emailTaken' }, { shouldFocus: true })
        return
      }
      const key = getErrorKey(err, { fallback: 'errors.auth.registerFailed' })
      enqueueSnackbar(t(key), { variant: 'error' })
    }
  }

  return (
    <ZodForm
      schema={registerSchema}
      defaultValues={{ name: '', email: '', password: '', confirmPassword: '' }}
      onSubmit={handleSubmit}
    >
      <Stack spacing={2.5}>
        <FormTextField
          name='name'
          label={t('auth.field.name.label')}
          placeholder={t('auth.field.name.placeholder')}
          fullWidth
        />
        <FormTextField name='email' label={t('auth.field.email.label')} placeholder='user@example.com' fullWidth />
        <FormPasswordField name='password' label={t('auth.field.password.label')} placeholder='••••••••' fullWidth />
        <FormPasswordField
          name='confirmPassword'
          label={t('auth.field.confirmPassword.label')}
          placeholder='••••••••'
          fullWidth
        />
        <Button type='submit' variant='contained' size='large' fullWidth disabled={isLoading}>
          {t('auth.register.submit')}
        </Button>
      </Stack>
    </ZodForm>
  )
}
