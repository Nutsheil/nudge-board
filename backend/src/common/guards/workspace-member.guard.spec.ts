import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

import { type PrismaService } from '../../prisma/prisma.service';
import { WorkspaceMemberGuard } from './workspace-member.guard';

const makeContext = (request: unknown): ExecutionContext =>
  ({ switchToHttp: () => ({ getRequest: () => request }) }) as ExecutionContext;

describe('WorkspaceMemberGuard', () => {
  const findUnique = jest.fn();
  const prisma = { workspaceMember: { findUnique } } as unknown as PrismaService;
  let guard: WorkspaceMemberGuard;

  beforeEach(() => {
    findUnique.mockReset();
    guard = new WorkspaceMemberGuard(prisma);
  });

  it('allows a member and attaches the role', async () => {
    findUnique.mockResolvedValue({ role: 'OWNER' });
    const request = { user: { id: 'u1' }, params: { workspaceId: 'w1' } };

    await expect(guard.canActivate(makeContext(request))).resolves.toBe(true);
    expect(findUnique).toHaveBeenCalledWith({
      where: { workspaceId_userId: { workspaceId: 'w1', userId: 'u1' } },
      select: { role: true },
    });
    expect((request as { workspaceRole?: string }).workspaceRole).toBe('OWNER');
  });

  it('rejects a non-member', async () => {
    findUnique.mockResolvedValue(null);
    const request = { user: { id: 'u1' }, params: { workspaceId: 'w1' } };

    await expect(guard.canActivate(makeContext(request))).rejects.toBeInstanceOf(ForbiddenException);
  });
});
