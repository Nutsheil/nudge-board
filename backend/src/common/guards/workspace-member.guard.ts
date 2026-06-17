import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { Request } from 'express';

import type { WorkspaceRole } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type GuardedRequest = Request & {
  user?: { id: string };
  params: { workspaceId: string };
  workspaceRole?: WorkspaceRole;
};

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<GuardedRequest>();
    const userId = request.user?.id;
    const workspaceId = request.params.workspaceId;

    if (!userId) {
      throw new ForbiddenException('Not authenticated');
    }
    if (!workspaceId) {
      throw new ForbiddenException('Workspace not specified');
    }

    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
      select: { role: true },
    });

    if (!membership) {
      throw new ForbiddenException('Not a workspace member');
    }

    // attach role for future role-based guards (Phase 2)
    request.workspaceRole = membership.role;
    return true;
  }
}
