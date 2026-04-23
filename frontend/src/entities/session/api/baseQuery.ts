import { env } from '@/shared/config'
import { createBaseQueryWithReauth } from '@/shared/api/baseQuery'

import { SESSION_SLICE_KEY, setCredentials, type WithSession } from '../model/slice'
import { forceLogout } from '../model/forceLogout'
import type { AuthResponse } from './sessionApi.types'

export const baseQueryWithReauth = createBaseQueryWithReauth<WithSession, AuthResponse>({
  baseUrl: env.VITE_API_URL,
  refreshUrl: 'auth/refresh',
  getAccessToken: (state) => state[SESSION_SLICE_KEY].accessToken,
  onRefreshSuccess: ({ accessToken }, api) => {
    api.dispatch(setCredentials(accessToken))
  },
  onAuthFailed: (api) => forceLogout(api.dispatch),
})
