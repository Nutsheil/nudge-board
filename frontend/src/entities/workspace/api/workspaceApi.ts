import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from '@/entities/session'

import type { Workspace } from '../model/types'

export interface CreateWorkspacePayload {
  name: string
  description?: string
}

export const workspaceApi = createApi({
  reducerPath: 'workspaceApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Workspaces'],

  endpoints: (builder) => ({
    getWorkspaces: builder.query<Workspace[], void>({
      query: () => ({ url: 'workspaces', method: 'GET' }),
      providesTags: ['Workspaces'],
    }),

    createWorkspace: builder.mutation<Workspace, CreateWorkspacePayload>({
      query: (body) => ({ url: 'workspaces', method: 'POST', body }),
      invalidatesTags: ['Workspaces'],
    }),
  }),
})

export const { useGetWorkspacesQuery, useCreateWorkspaceMutation } = workspaceApi
