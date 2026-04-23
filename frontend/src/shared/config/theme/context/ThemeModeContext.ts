import { createContext } from 'react'
import type { PaletteName } from '../palettes'

export interface ThemeModeContextValue {
  palette: PaletteName
  setPalette: (palette: PaletteName) => void
  toggle: () => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)
