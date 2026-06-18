import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from '@/entities/session'

import type { Board, BoardTree } from '../model/types'

export interface CreateBoardPayload {
  workspaceId: string
  name: string
  description?: string
}

export interface UpdateBoardPayload {
  workspaceId: string
  boardId: string
  name?: string
  description?: string
}

export interface DeleteBoardArgs {
  workspaceId: string
  boardId: string
}

export const boardApi = createApi({
  reducerPath: 'boardApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Boards'],

  endpoints: (builder) => ({
    getBoards: builder.query<Board[], string>({
      query: (workspaceId) => ({ url: `workspaces/${workspaceId}/boards`, method: 'GET' }),
      providesTags: (result) =>
        result
          ? [...result.map((b) => ({ type: 'Boards' as const, id: b.id })), { type: 'Boards' as const, id: 'LIST' }]
          : [{ type: 'Boards' as const, id: 'LIST' }],
    }),

    getBoard: builder.query<BoardTree, { workspaceId: string; boardId: string }>({
      query: ({ workspaceId, boardId }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { boardId }) => [{ type: 'Boards', id: boardId }],
    }),

    createBoard: builder.mutation<Board, CreateBoardPayload>({
      query: ({ workspaceId, ...body }) => ({ url: `workspaces/${workspaceId}/boards`, method: 'POST', body }),
      invalidatesTags: [{ type: 'Boards', id: 'LIST' }],
    }),

    updateBoard: builder.mutation<Board, UpdateBoardPayload>({
      query: ({ workspaceId, boardId, ...body }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: 'Boards', id: boardId },
        { type: 'Boards', id: 'LIST' },
      ],
    }),

    deleteBoard: builder.mutation<void, DeleteBoardArgs>({
      query: ({ workspaceId, boardId }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Boards', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetBoardsQuery,
  useGetBoardQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} = boardApi
