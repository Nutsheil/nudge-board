export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER'

export interface Workspace {
  id: string
  name: string
  description: string | null
  role: WorkspaceRole
  membersCount: number
  boardsCount: number
}
