import { Box, Button, Stack, Typography } from '@mui/material'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router'

import { forceLogout } from '@/entities/session'
import { ROUTES } from '@/shared/config'
import { useAppDispatch } from '@/shared/store'

type Variant = 'public' | 'auth' | 'app'

interface Props {
  variant: Variant
}

const getMessage = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Unknown error'
}

export const RouteErrorElement = (props: Props) => {
  const { variant } = props

  const error = useRouteError()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const message = getMessage(error)
  const isDev = import.meta.env.DEV

  const reload = () => {
    window.location.reload()
  }

  const goHome = () => {
    navigate(ROUTES.landing)
  }

  const handleLogout = () => {
    forceLogout(dispatch)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <Stack spacing={2} sx={{ alignItems: 'center', maxWidth: 480 }}>
        <Typography variant='h5'>Что-то пошло не так</Typography>
        {isDev && (
          <Typography variant='body2' color='text.secondary' sx={{ wordBreak: 'break-word' }}>
            {message}
          </Typography>
        )}
        <Stack direction='row' spacing={1}>
          <Button variant='contained' onClick={reload}>
            Попробовать снова
          </Button>
          {(variant === 'public' || variant === 'auth') && (
            <Button variant='outlined' onClick={goHome}>
              На главную
            </Button>
          )}
          {variant === 'app' && (
            <Button variant='outlined' onClick={handleLogout}>
              Выйти
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
