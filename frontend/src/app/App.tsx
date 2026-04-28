import { SnackbarProvider } from 'notistack'

import { useSessionBootstrap } from '@/entities/session'

import { RouterProvider } from './providers/router'
import { StoreProvider } from './providers/store'
import { ThemeProvider } from './providers/theme'

const AppInner = () => {
  useSessionBootstrap()

  return (
    <ThemeProvider>
      <SnackbarProvider>
        <RouterProvider />
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export const App = () => {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  )
}
