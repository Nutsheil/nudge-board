import { Button, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'

import { useLoginMutation } from '@/entities/session'
import { isFetchError } from '@/shared/api/errors'
import { ZodForm, createFormFields } from '@/shared/ui'

import { loginSchema, type LoginValues } from '../model/schema'

const { FormTextField, FormPasswordField } = createFormFields<LoginValues>()

const getLoginErrorMessage = (err: unknown): string => {
  if (isFetchError(err)) {
    if (err.status === 401) return 'Неверный email или пароль'
    if (err.status === 'FETCH_ERROR') return 'Нет соединения с сервером. Проверьте интернет.'
    if (typeof err.status === 'number' && err.status >= 500) return 'Сервер недоступен. Попробуйте позже.'
  }
  return 'Не удалось войти. Попробуйте ещё раз.'
}

export const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation()
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = async (values: LoginValues) => {
    try {
      await login(values).unwrap()
    } catch (err) {
      enqueueSnackbar(getLoginErrorMessage(err), { variant: 'error' })
    }
  }

  return (
    <ZodForm schema={loginSchema} defaultValues={{ email: '', password: '' }} onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <FormTextField name='email' label='Email' placeholder='user@example.com' fullWidth />
        <FormPasswordField name='password' label='Пароль' placeholder='••••••••' fullWidth />
        <Button type='submit' variant='contained' size='large' fullWidth disabled={isLoading}>
          Войти
        </Button>
      </Stack>
    </ZodForm>
  )
}
