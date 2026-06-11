const SESSION_HINT_KEY = 'app-session'

export const hasSessionHint = (): boolean => {
  try {
    return localStorage.getItem(SESSION_HINT_KEY) === '1'
  } catch {
    return false
  }
}

export const setSessionHint = (): void => {
  try {
    localStorage.setItem(SESSION_HINT_KEY, '1')
  } catch {
    /* storage unavailable (private mode / SSR) — bootstrap just falls back to trying refresh */
  }
}

export const clearSessionHint = (): void => {
  try {
    localStorage.removeItem(SESSION_HINT_KEY)
  } catch {
    /* ignore */
  }
}
