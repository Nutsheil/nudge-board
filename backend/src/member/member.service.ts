import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { MemberDto } from './dto/member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async list(workspaceId: string): Promise<MemberDto[]> {
    const rows = await this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      orderBy: { user: { name: 'asc' } },
      select: { user: { select: { id: true, name: true, email: true } } },
    });
    return rows.map((r) => r.user);
  }
}
