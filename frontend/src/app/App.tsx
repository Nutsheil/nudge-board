import { SnackbarProvider } from 'notistack'

import { useSessionBootstrap } from '@/entities/session'

import { I18nProvider } from './providers/i18n'
import { RouterProvider } from './providers/router'
import { StoreProvider } from './providers/store'
import { ThemeProvider } from './providers/theme'

const AppInner = () => {
  useSessionBootstrap()

  return (
    <I18nProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <RouterProvider />
        </SnackbarProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}

export const App = () => {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  )
}
