import { Injectable } from '@nestjs/common';

import { WorkspaceRole } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import type { WorkspaceDto } from './dto/workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<WorkspaceDto[]> {
    const workspaces = await this.prisma.workspace.findMany({
      where: { members: { some: { userId } } },
      orderBy: { createdAt: 'asc' },
      include: {
        members: { where: { userId }, select: { role: true } },
        _count: { select: { members: true, boards: true } },
      },
    });

    return workspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      description: ws.description,
      role: ws.members[0].role,
      membersCount: ws._count.members,
      boardsCount: ws._count.boards,
    }));
  }

  async create(userId: string, dto: CreateWorkspaceDto): Promise<WorkspaceDto> {
    const workspace = await this.prisma.workspace.create({
      data: {
        name: dto.name,
        description: dto.description,
        members: { create: { userId, role: WorkspaceRole.OWNER } },
      },
    });

    return {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      role: WorkspaceRole.OWNER,
      membersCount: 1,
      boardsCount: 0,
    };
  }
}
