import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { sessionApi, sessionReducer, SESSION_SLICE_KEY } from '@/entities/session'
import { workspaceApi } from '@/entities/workspace'

export const store = configureStore({
  reducer: {
    [SESSION_SLICE_KEY]: sessionReducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [workspaceApi.reducerPath]: workspaceApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sessionApi.middleware, workspaceApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
