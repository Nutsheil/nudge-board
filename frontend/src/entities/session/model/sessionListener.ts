import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'

import { clearSessionHint, setSessionHint } from './sessionHint'
import { logout, setCredentials } from './slice'

export const sessionListener = createListenerMiddleware()

sessionListener.startListening({
  matcher: isAnyOf(setCredentials),
  effect: () => setSessionHint(),
})

sessionListener.startListening({
  matcher: isAnyOf(logout),
  effect: () => clearSessionHint(),
})
