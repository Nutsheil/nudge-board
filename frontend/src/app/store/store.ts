import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { boardApi } from '@/entities/board'
import { sessionApi, sessionListener, sessionReducer, SESSION_SLICE_KEY } from '@/entities/session'
import { workspaceApi } from '@/entities/workspace'

export const store = configureStore({
  reducer: {
    [SESSION_SLICE_KEY]: sessionReducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [workspaceApi.reducerPath]: workspaceApi.reducer,
    [boardApi.reducerPath]: boardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(sessionListener.middleware).concat(sessionApi.middleware, workspaceApi.middleware, boardApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
