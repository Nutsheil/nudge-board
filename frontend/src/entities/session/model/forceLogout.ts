import type { Dispatch } from '@reduxjs/toolkit'

import { logout } from './slice'

export const forceLogout = (dispatch: Dispatch) => {
  dispatch(logout())
  window.location.assign('/')
}
