import { Button, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import { useLoginMutation } from '@/entities/session'
import { getErrorKey } from '@/shared/api/errors'
import { ZodForm, createFormFields } from '@/shared/ui'

import { loginSchema, type LoginValues } from '../model/schema'

const { FormTextField, FormPasswordField } = createFormFields<LoginValues>()

export const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['auth', 'errors'])

  const handleSubmit = async (values: LoginValues) => {
    try {
      await login(values).unwrap()
    } catch (err) {
      const key = getErrorKey(err, {
        fallback: 'errors.auth.loginFailed',
        byStatus: { 401: 'errors.auth.invalidCredentials' },
      })
      enqueueSnackbar(t(key), { variant: 'error' })
    }
  }

  return (
    <ZodForm schema={loginSchema} defaultValues={{ email: '', password: '' }} onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <FormTextField name='email' label={t('auth.field.email.label')} placeholder='user@example.com' fullWidth />
        <FormPasswordField name='password' label={t('auth.field.password.label')} placeholder='••••••••' fullWidth />
        <Button type='submit' variant='contained' size='large' fullWidth disabled={isLoading}>
          {t('auth.login.submit')}
        </Button>
      </Stack>
    </ZodForm>
  )
}
