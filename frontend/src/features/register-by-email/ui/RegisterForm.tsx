import { Button, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import type { UseFormSetError } from 'react-hook-form'

import { useRegisterMutation } from '@/entities/session'
import { isFetchError } from '@/shared/api/errors'
import { ZodForm, createFormFields } from '@/shared/ui'

import { registerSchema, type RegisterValues } from '../model/schema'

const { FormTextField, FormPasswordField } = createFormFields<RegisterValues>()

const handleRegisterError = (
  err: unknown,
  setError: UseFormSetError<RegisterValues>,
  toast: (message: string) => void,
) => {
  if (isFetchError(err)) {
    if (err.status === 409) {
      setError('email', { type: 'server', message: 'Этот email уже занят' }, { shouldFocus: true })
      return
    }
    if (err.status === 'FETCH_ERROR') {
      toast('Нет соединения с сервером. Проверьте интернет.')
      return
    }
    if (typeof err.status === 'number' && err.status >= 500) {
      toast('Сервер недоступен. Попробуйте позже.')
      return
    }
  }
  toast('Не удалось создать аккаунт. Попробуйте ещё раз.')
}

export const RegisterForm = () => {
  const [register, { isLoading }] = useRegisterMutation()
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = async (values: RegisterValues, methods: { setError: UseFormSetError<RegisterValues> }) => {
    const { name, email, password } = values
    try {
      await register({ name, email, password }).unwrap()
    } catch (err) {
      handleRegisterError(err, methods.setError, (message) => enqueueSnackbar(message, { variant: 'error' }))
    }
  }

  return (
    <ZodForm
      schema={registerSchema}
      defaultValues={{ name: '', email: '', password: '', confirmPassword: '' }}
      onSubmit={handleSubmit}
    >
      <Stack spacing={2.5}>
        <FormTextField name='name' label='Имя' placeholder='Иван' fullWidth />
        <FormTextField name='email' label='Email' placeholder='user@example.com' fullWidth />
        <FormPasswordField name='password' label='Пароль' placeholder='••••••••' fullWidth />
        <FormPasswordField name='confirmPassword' label='Повторите пароль' placeholder='••••••••' fullWidth />
        <Button type='submit' variant='contained' size='large' fullWidth disabled={isLoading}>
          Создать аккаунт
        </Button>
      </Stack>
    </ZodForm>
  )
}
