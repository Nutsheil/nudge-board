import { createApi } from '@reduxjs/toolkit/query/react'

import { boardApi, type BoardTask, type LabelView, type Priority } from '@/entities/board'
import type { Label } from '@/entities/label'
import type { Member } from '@/entities/member'
import { baseQueryWithReauth } from '@/entities/session'

import type { TaskDetail, TaskDetailAssignee } from '../model/types'

interface CreateTaskArgs {
  workspaceId: string
  boardId: string
  columnId: string
  title: string
}

export interface TaskPatch {
  title?: string
  description?: string | null
  priority?: Priority
  timeEstimate?: number | null
  timeSpent?: number
  dueDate?: string | null
}

interface UpdateTaskArgs {
  workspaceId: string
  boardId: string
  taskId: string
  patch: TaskPatch
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
    getTask: builder.query<TaskDetail, { workspaceId: string; boardId: string; taskId: string }>({
      query: ({ workspaceId, boardId, taskId }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}`,
        method: 'GET',
      }),
    }),

    createTask: builder.mutation<Omit<BoardTask, 'assignees'>, CreateTaskArgs>({
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
              col.tasks.push({ ...data, assignees: [], labels: [] })
              col.tasks.sort((a, b) => a.position - b.position)
            }),
          )
        } catch {
          // error toast handled by the component
        }
      },
    }),

    updateTask: builder.mutation<TaskDetail, UpdateTaskArgs>({
      query: ({ workspaceId, boardId, taskId, patch }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}`,
        method: 'PATCH',
        body: patch,
      }),
      async onQueryStarted({ workspaceId, boardId, taskId, patch }, { dispatch, queryFulfilled }) {
        // Patch the task-detail cache (every field the page shows).
        const detailPatch = dispatch(
          taskApi.util.updateQueryData('getTask', { workspaceId, boardId, taskId }, (draft) => {
            Object.assign(draft, patch)
          }),
        )
        // Patch the board card cache (only the card-visible fields).
        const boardPatch = dispatch(
          boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
            for (const col of draft.columns) {
              const task = col.tasks.find((t) => t.id === taskId)
              if (!task) continue
              if (patch.title !== undefined) task.title = patch.title
              if (patch.priority !== undefined) task.priority = patch.priority
              if (patch.dueDate !== undefined) task.dueDate = patch.dueDate
              break
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          detailPatch.undo()
          boardPatch.undo()
        }
      },
    }),

    setAssignees: builder.mutation<
      TaskDetailAssignee[],
      { workspaceId: string; boardId: string; taskId: string; userIds: string[]; members: Member[] }
    >({
      query: ({ workspaceId, boardId, taskId, userIds }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}/assignees`,
        method: 'PUT',
        body: { userIds },
      }),
      async onQueryStarted(
        { workspaceId, boardId, taskId, userIds, members },
        { dispatch, queryFulfilled },
      ) {
        const selected = members.filter((m) => userIds.includes(m.id))
        const detailPatch = dispatch(
          taskApi.util.updateQueryData('getTask', { workspaceId, boardId, taskId }, (draft) => {
            draft.assignees = selected.map((m) => ({ id: m.id, name: m.name, email: m.email }))
          }),
        )
        const boardPatch = dispatch(
          boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
            for (const col of draft.columns) {
              const task = col.tasks.find((t) => t.id === taskId)
              if (!task) continue
              task.assignees = selected.map((m) => ({ id: m.id, name: m.name }))
              break
            }
          }),
        )
        try {
          const { data } = await queryFulfilled
          // Reconcile with the server's canonical order.
          dispatch(
            taskApi.util.updateQueryData('getTask', { workspaceId, boardId, taskId }, (draft) => {
              draft.assignees = data
            }),
          )
          dispatch(
            boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
              for (const col of draft.columns) {
                const task = col.tasks.find((t) => t.id === taskId)
                if (!task) continue
                task.assignees = data.map((a) => ({ id: a.id, name: a.name }))
                break
              }
            }),
          )
        } catch {
          detailPatch.undo()
          boardPatch.undo()
        }
      },
    }),

    setLabels: builder.mutation<
      LabelView[],
      { workspaceId: string; boardId: string; taskId: string; labelIds: string[]; labels: Label[] }
    >({
      query: ({ workspaceId, boardId, taskId, labelIds }) => ({
        url: `workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}/labels`,
        method: 'PUT',
        body: { labelIds },
      }),
      async onQueryStarted(
        { workspaceId, boardId, taskId, labelIds, labels },
        { dispatch, queryFulfilled },
      ) {
        const selected: LabelView[] = labels
          .filter((l) => labelIds.includes(l.id))
          .map((l) => ({ id: l.id, name: l.name, color: l.color }))
        const detailPatch = dispatch(
          taskApi.util.updateQueryData('getTask', { workspaceId, boardId, taskId }, (draft) => {
            draft.labels = selected
          }),
        )
        const boardPatch = dispatch(
          boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
            for (const col of draft.columns) {
              const task = col.tasks.find((t) => t.id === taskId)
              if (!task) continue
              task.labels = selected
              break
            }
          }),
        )
        try {
          const { data } = await queryFulfilled
          // Reconcile with the server's canonical order.
          dispatch(
            taskApi.util.updateQueryData('getTask', { workspaceId, boardId, taskId }, (draft) => {
              draft.labels = data
            }),
          )
          dispatch(
            boardApi.util.updateQueryData('getBoard', { workspaceId, boardId }, (draft) => {
              for (const col of draft.columns) {
                const task = col.tasks.find((t) => t.id === taskId)
                if (!task) continue
                task.labels = data
                break
              }
            }),
          )
        } catch {
          detailPatch.undo()
          boardPatch.undo()
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
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useMoveTaskMutation,
  useSetAssigneesMutation,
  useSetLabelsMutation,
} = taskApi
