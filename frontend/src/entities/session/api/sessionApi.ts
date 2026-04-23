import { createApi } from '@reduxjs/toolkit/query/react'

import { setCredentials } from '../model/slice'
import { forceLogout } from '../model/forceLogout'
import { baseQueryWithReauth } from './baseQuery'

import type { AuthResponse, LoginPayload, RegisterPayload } from './sessionApi.types'

export const sessionApi = createApi({
  reducerPath: 'sessionApi',
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data.accessToken))
        } catch {
          /* ошибка будет обработана вызывающим кодом */
        }
      },
    }),

    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (body) => ({ url: 'auth/register', method: 'POST', body }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data.accessToken))
        } catch {
          /* ошибка будет обработана вызывающим кодом */
        }
      },
    }),

    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({ url: 'auth/refresh', method: 'POST' }),
      extraOptions: { skipReauth: true },
      // setCredentials: auto-refresh кладёт токен в onRefreshSuccess, bootstrap - в useSessionBootstrap.
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: 'auth/logout', method: 'POST' }),
      extraOptions: { skipReauth: true },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
        } catch {
          /* logout локально в любом случае */
        }
        forceLogout(dispatch)
      },
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = sessionApi
