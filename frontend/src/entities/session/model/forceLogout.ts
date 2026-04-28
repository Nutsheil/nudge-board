import type { Dispatch } from '@reduxjs/toolkit'

import { ROUTES } from '@/shared/config'

import { logout } from './slice'

export const forceLogout = (dispatch: Dispatch) => {
  dispatch(logout())
  window.location.assign(ROUTES.landing)
}
