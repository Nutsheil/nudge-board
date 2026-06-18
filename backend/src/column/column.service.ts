import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { ColumnDto } from './dto/column.dto';
import type { CreateColumnDto } from './dto/create-column.dto';
import type { MoveColumnDto } from './dto/move-column.dto';
import type { UpdateColumnDto } from './dto/update-column.dto';

const COLUMN_SELECT = { id: true, name: true, position: true } as const;
const POSITION_EPSILON = 1e-6;

@Injectable()
export class ColumnService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, boardId: string, dto: CreateColumnDto): Promise<ColumnDto> {
    await this.assertBoardInWorkspace(workspaceId, boardId);

    const last = await this.prisma.column.findFirst({
      where: { boardId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const position = last ? last.position + 1 : 1;

    return this.prisma.column.create({
      data: { boardId, name: dto.name, position },
      select: COLUMN_SELECT,
    });
  }

  async update(workspaceId: string, boardId: string, columnId: string, dto: UpdateColumnDto): Promise<ColumnDto> {
    await this.assertColumnInBoard(workspaceId, boardId, columnId);

    return this.prisma.column.update({
      where: { id: columnId },
      data: { name: dto.name },
      select: COLUMN_SELECT,
    });
  }

  async remove(workspaceId: string, boardId: string, columnId: string): Promise<void> {
    await this.assertColumnInBoard(workspaceId, boardId, columnId);
    await this.prisma.column.delete({ where: { id: columnId } });
  }

  async move(workspaceId: string, boardId: string, columnId: string, dto: MoveColumnDto): Promise<ColumnDto> {
    await this.assertColumnInBoard(workspaceId, boardId, columnId);

    const columns = await this.prisma.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
      select: { id: true, position: true },
    });

    const others = columns.filter((c) => c.id !== columnId);
    const { afterId } = dto;

    if (afterId !== null && !others.some((c) => c.id === afterId)) {
      throw new NotFoundException('Anchor column not found');
    }

    const prevIndex = afterId === null ? -1 : others.findIndex((c) => c.id === afterId);
    const prev = prevIndex >= 0 ? others[prevIndex] : undefined;
    const next = others[prevIndex + 1];

    let position: number;
    if (!prev && !next) {
      position = 0;
    } else if (!prev) {
      position = next.position - 1;
    } else if (!next) {
      position = prev.position + 1;
    } else if (next.position - prev.position < POSITION_EPSILON) {
      return this.rebalanceAndPlace(others, columnId, prevIndex);
    } else {
      position = (prev.position + next.position) / 2;
    }

    return this.prisma.column.update({ where: { id: columnId }, data: { position }, select: COLUMN_SELECT });
  }

  private async assertBoardInWorkspace(workspaceId: string, boardId: string): Promise<void> {
    const board = await this.prisma.board.findFirst({ where: { id: boardId, workspaceId }, select: { id: true } });
    if (!board) {
      throw new NotFoundException('Board not found');
    }
  }

  private async assertColumnInBoard(workspaceId: string, boardId: string, columnId: string): Promise<void> {
    const column = await this.prisma.column.findFirst({
      where: { id: columnId, boardId, board: { workspaceId } },
      select: { id: true },
    });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
  }

  private async rebalanceAndPlace(
    others: { id: string }[],
    columnId: string,
    prevIndex: number,
  ): Promise<ColumnDto> {
    const orderedIds = others.map((c) => c.id);
    orderedIds.splice(prevIndex + 1, 0, columnId);

    const updates = orderedIds.map((id, i) =>
      this.prisma.column.update({ where: { id }, data: { position: i + 1 }, select: COLUMN_SELECT }),
    );
    const results = await this.prisma.$transaction(updates);
    return results.find((c) => c.id === columnId) as ColumnDto;
  }
}
