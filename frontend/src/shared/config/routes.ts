export const ROUTES = {
  landing: '/',
  auth: '/auth',
  app: '/app',
  workspace: (id: string) => `/app/${id}`,
  workspacePattern: '/app/:workspaceId',
  board: (workspaceId: string, boardId: string) => `/app/${workspaceId}/board/${boardId}`,
  boardPattern: '/app/:workspaceId/board/:boardId',
} as const
