import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { sessionApi, sessionReducer, SESSION_SLICE_KEY } from '@/entities/session'

export const store = configureStore({
  reducer: {
    [SESSION_SLICE_KEY]: sessionReducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sessionApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
