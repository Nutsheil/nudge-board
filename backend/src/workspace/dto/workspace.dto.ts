import type { WorkspaceRole } from '../../../generated/prisma/client';

export interface WorkspaceDto {
  id: string;
  name: string;
  description: string | null;
  role: WorkspaceRole;
  membersCount: number;
  boardsCount: number;
}
