import { createApi } from '@reduxjs/toolkit/query/react'

import { boardApi, type BoardTask } from '@/entities/board'
import { baseQueryWithReauth } from '@/entities/session'

interface CreateTaskArgs {
  workspaceId: string
  boardId: string
  columnId: string
  title: string
}

interface UpdateTaskArgs {
  workspaceId: string
  boardId: string
  taskId: string
  title: string
}

interface DeleteTaskArgs {
  workspaceId: string
  boardId: string
  taskId: string
}

interface MoveTaskArgs {
  workspaceId: string
  boardId: string
  taskId: string
  targetColumnId: string
  afterId: string | null
}

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    createTask: builder.mutation<BoardTask, CreateTaskArgs>({
      query: ({ workspaceId, boardId, columnId, title }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/columns/${columnId}/tasks`,
        method: 'POST',
        body: { title },
      }),
      // No id until the server responds: insert on fulfill (no flicker, no refetch).
      async onQueryStarted({ workspaceId, boardId, columnId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
              const col = draft.columns.find((c) => c.id === columnId)
              if (!col) return
              col.tasks.push(data)
              col.tasks.sort((a, b) => a.position - b.position)
            }),
          )
        } catch {
          // error toast handled by the component
        }
      },
    }),

    updateTask: builder.mutation<BoardTask, UpdateTaskArgs>({
      query: ({ workspaceId, boardId, taskId, title }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}`,
        method: 'PATCH',
        body: { title },
      }),
      async onQueryStarted({ workspaceId, boardId, taskId, title }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
            for (const col of draft.columns) {
              const task = col.tasks.find((t) => t.id === taskId)
              if (task) {
                task.title = title
                break
              }
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),

    deleteTask: builder.mutation<void, DeleteTaskArgs>({
      query: ({ workspaceId, boardId, taskId }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ workspaceId, boardId, taskId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
            for (const col of draft.columns) {
              const idx = col.tasks.findIndex((t) => t.id === taskId)
              if (idx !== -1) {
                col.tasks.splice(idx, 1)
                break
              }
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),

    moveTask: builder.mutation<BoardTask, MoveTaskArgs>({
      query: ({ workspaceId, boardId, taskId, targetColumnId, afterId }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}/move`,
        method: 'PATCH',
        body: { targetColumnId, afterId },
      }),
      async onQueryStarted(
        { workspaceId, boardId, taskId, targetColumnId, afterId },
        { dispatch, queryFulfilled },
      ) {
        const patch = dispatch(
          boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
            let moved: BoardTask | undefined
            for (const col of draft.columns) {
              const idx = col.tasks.findIndex((t) => t.id === taskId)
              if (idx !== -1) {
                ;[moved] = col.tasks.splice(idx, 1)
                break
              }
            }
            if (!moved) return
            const target = draft.columns.find((c) => c.id === targetColumnId)
            if (!target) return
            moved.columnId = targetColumnId
            const afterIndex = afterId === null ? -1 : target.tasks.findIndex((t) => t.id === afterId)
            target.tasks.splice(afterIndex + 1, 0, moved)
          }),
        )
        try {
          const { data } = await queryFulfilled
          dispatch(
            boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
              const col = draft.columns.find((c) => c.id === data.columnId)
              const task = col?.tasks.find((t) => t.id === data.id)
              if (task) task.position = data.position
              col?.tasks.sort((a, b) => a.position - b.position)
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
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useMoveTaskMutation,
} = taskApi
