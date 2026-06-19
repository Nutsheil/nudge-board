import { type PrismaService } from '../prisma/prisma.service';
import { MemberService } from './member.service';

describe('MemberService', () => {
  const workspaceMember = { findMany: jest.fn() };
  const prisma = { workspaceMember } as unknown as PrismaService;
  let service: MemberService;

  beforeEach(() => {
    workspaceMember.findMany.mockReset();
    service = new MemberService(prisma);
  });

  it('lists workspace members as flattened users ordered by name', async () => {
    workspaceMember.findMany.mockResolvedValue([
      { user: { id: 'u1', name: 'Ann', email: 'ann@x.io' } },
      { user: { id: 'u2', name: 'Bo', email: 'bo@x.io' } },
    ]);

    const result = await service.list('w1');

    expect(workspaceMember.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1' },
      orderBy: { user: { name: 'asc' } },
      select: { user: { select: { id: true, name: true, email: true } } },
    });
    expect(result).toEqual([
      { id: 'u1', name: 'Ann', email: 'ann@x.io' },
      { id: 'u2', name: 'Bo', email: 'bo@x.io' },
    ]);
  });
});
