import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createAppTheme, ThemeModeContext, type PaletteName, type ThemeModeContextValue } from '@/shared/config/theme'
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'

interface Props {
  children: ReactNode
}

const THEME_STORAGE_KEY = 'app-theme'

function isValidTheme(theme?: string | null): theme is PaletteName {
  return theme === 'dark' || theme === 'light'
}

const getInitialThemeMode = (): PaletteName => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (isValidTheme(saved)) return saved

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export const ThemeProvider = (props: Props) => {
  const { children } = props

  const [palette, setPalette] = useState<PaletteName>(() => getInitialThemeMode())

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, palette)
  }, [palette])

  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        const theme = e.newValue

        if (isValidTheme(theme)) {
          setPalette(theme)
        }
      }
    }

    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const toggle = useCallback(() => setPalette((prev) => (prev === 'dark' ? 'light' : 'dark')), [])
  const theme = useMemo(() => createAppTheme(palette), [palette])

  const contextValue = useMemo<ThemeModeContextValue>(() => ({ palette, setPalette, toggle }), [palette, toggle])

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  )
}
