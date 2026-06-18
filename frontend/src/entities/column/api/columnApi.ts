import { createApi } from '@reduxjs/toolkit/query/react'

import { boardApi, type ColumnEntity } from '@/entities/board'
import { baseQueryWithReauth } from '@/entities/session'

interface CreateColumnArgs {
  workspaceId: string
  boardId: string
  name: string
}

interface UpdateColumnArgs {
  workspaceId: string
  boardId: string
  columnId: string
  name: string
}

interface DeleteColumnArgs {
  workspaceId: string
  boardId: string
  columnId: string
}

interface MoveColumnArgs {
  workspaceId: string
  boardId: string
  columnId: string
  afterId: string | null
}

export const columnApi = createApi({
  reducerPath: 'columnApi',
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    createColumn: builder.mutation<ColumnEntity, CreateColumnArgs>({
      query: ({ workspaceId, boardId, name }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/columns`,
        method: 'POST',
        body: { name },
      }),
      // No id until the server responds: insert on fulfill (no flicker, no refetch).
      async onQueryStarted({ workspaceId, boardId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
              draft.columns.push({ ...data, tasks: [] })
              draft.columns.sort((a, b) => a.position - b.position)
            }),
          )
        } catch {
          // error toast handled by the dialog
        }
      },
    }),

    updateColumn: builder.mutation<ColumnEntity, UpdateColumnArgs>({
      query: ({ workspaceId, boardId, columnId, name }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}`,
        method: 'PATCH',
        body: { name },
      }),
      async onQueryStarted({ workspaceId, boardId, columnId, name }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
            const col = draft.columns.find((c) => c.id === columnId)
            if (col) col.name = name
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),

    deleteColumn: builder.mutation<void, DeleteColumnArgs>({
      query: ({ workspaceId, boardId, columnId }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ workspaceId, boardId, columnId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
            draft.columns = draft.columns.filter((c) => c.id !== columnId)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),

    moveColumn: builder.mutation<ColumnEntity, MoveColumnArgs>({
      query: ({ workspaceId, boardId, columnId, afterId }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/move`,
        method: 'PATCH',
        body: { afterId },
      }),
      async onQueryStarted({ workspaceId, boardId, columnId, afterId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
            const from = draft.columns.findIndex((c) => c.id === columnId)
            if (from === -1) return
            const [moved] = draft.columns.splice(from, 1)
            const afterIndex = afterId === null ? -1 : draft.columns.findIndex((c) => c.id === afterId)
            draft.columns.splice(afterIndex + 1, 0, moved)
          }),
        )
        try {
          const { data } = await queryFulfilled
          dispatch(
            boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
              const col = draft.columns.find((c) => c.id === data.id)
              if (col) col.position = data.position
              draft.columns.sort((a, b) => a.position - b.position)
            }),
          )
        } catch {
          patch.undo()
        }
      },
    }),
  }),
})

export const {
  useCreateColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
  useMoveColumnMutation,
} = columnApi
