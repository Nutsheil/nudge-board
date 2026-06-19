export const ROUTES = {
  landing: '/',
  auth: '/auth',
  app: '/app',
  workspace: (id: string) => `/app/${id}`,
  workspacePattern: '/app/:workspaceId',
  board: (workspaceId: string, boardId: string) => `/app/${workspaceId}/board/${boardId}`,
  boardPattern: '/app/:workspaceId/board/:boardId',
  task: (workspaceId: string, boardId: string, taskId: string) =>
    `/app/${workspaceId}/board/${boardId}/task/${taskId}`,
  taskPattern: '/app/:workspaceId/board/:boardId/task/:taskId',
} as const
