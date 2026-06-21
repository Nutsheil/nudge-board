import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from '@/entities/session'

import type { Label, LabelColor } from '../model/types'

interface CreateLabelArgs {
  workspaceId: string
  name: string
  color: LabelColor
}

interface UpdateLabelArgs {
  workspaceId: string
  labelId: string
  patch: { name?: string; color?: LabelColor }
}

interface DeleteLabelArgs {
  workspaceId: string
  labelId: string
}

export const labelApi = createApi({
  reducerPath: 'labelApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Labels'],

  endpoints: (builder) => ({
    getLabels: builder.query<Label[], string>({
      query: (workspaceId) => ({ url: `workspaces/${workspaceId}/labels`, method: 'GET' }),
      providesTags: (_result, _error, workspaceId) => [{ type: 'Labels', id: workspaceId }],
    }),

    createLabel: builder.mutation<Label, CreateLabelArgs>({
      query: ({ workspaceId, name, color }) => ({
        url: `workspaces/${workspaceId}/labels`,
        method: 'POST',
        body: { name, color },
      }),
      invalidatesTags: (_result, _error, { workspaceId }) => [{ type: 'Labels', id: workspaceId }],
    }),

    updateLabel: builder.mutation<Label, UpdateLabelArgs>({
      query: ({ workspaceId, labelId, patch }) => ({
        url: `workspaces/${workspaceId}/labels/${labelId}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { workspaceId }) => [{ type: 'Labels', id: workspaceId }],
    }),

    deleteLabel: builder.mutation<void, DeleteLabelArgs>({
      query: ({ workspaceId, labelId }) => ({
        url: `workspaces/${workspaceId}/labels/${labelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { workspaceId }) => [{ type: 'Labels', id: workspaceId }],
    }),
  }),
})

export const {
  useGetLabelsQuery,
  useCreateLabelMutation,
  useUpdateLabelMutation,
  useDeleteLabelMutation,
} = labelApi
