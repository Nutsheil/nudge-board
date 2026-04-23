import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const SESSION_SLICE_KEY = 'session' as const

export type BootstrapStatus = 'pending' | 'done' | 'error'

export interface SessionState {
  accessToken: string | null
  isAuth: boolean
  bootstrapStatus: BootstrapStatus
}

export type WithSession = { [SESSION_SLICE_KEY]: SessionState }

const initialState: SessionState = {
  accessToken: null,
  isAuth: false,
  bootstrapStatus: 'pending',
}

const sessionSlice = createSlice({
  name: SESSION_SLICE_KEY,
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      state.isAuth = true
    },
    logout: (state) => {
      state.accessToken = null
      state.isAuth = false
    },
    bootstrapFinished: (state, action: PayloadAction<Extract<BootstrapStatus, 'done' | 'error'>>) => {
      state.bootstrapStatus = action.payload
    },
  },
})

export const { setCredentials, logout, bootstrapFinished } = sessionSlice.actions
export const sessionReducer = sessionSlice.reducer
