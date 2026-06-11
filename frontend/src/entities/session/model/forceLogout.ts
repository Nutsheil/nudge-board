import type { Dispatch } from '@reduxjs/toolkit'

import { ROUTES } from '@/shared/config'

import { clearSessionHint } from './sessionHint'
import { logout } from './slice'

export const forceLogout = (dispatch: Dispatch) => {
  dispatch(logout())
  clearSessionHint()
  window.location.assign(ROUTES.landing)
}
