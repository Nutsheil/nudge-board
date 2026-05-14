export const ROUTES = {
  landing: '/',
  auth: '/auth',
  app: '/app',
  workspace: (id: string) => `/app/${id}`,
  workspacePattern: '/app/:workspaceId',
} as const
