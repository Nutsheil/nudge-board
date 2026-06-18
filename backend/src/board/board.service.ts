import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { BoardSummaryDto, BoardTreeDto } from './dto/board.dto';
import type { CreateBoardDto } from './dto/create-board.dto';
import type { UpdateBoardDto } from './dto/update-board.dto';

const SUMMARY_SELECT = { id: true, name: true, description: true, createdAt: true } as const;

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  list(workspaceId: string): Promise<BoardSummaryDto[]> {
    return this.prisma.board.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'asc' },
      select: SUMMARY_SELECT,
    });
  }

  create(workspaceId: string, dto: CreateBoardDto): Promise<BoardSummaryDto> {
    return this.prisma.board.create({
      data: { workspaceId, name: dto.name, description: dto.description },
      select: SUMMARY_SELECT,
    });
  }

  async getBoard(workspaceId: string, boardId: string): Promise<BoardTreeDto> {
    const board = await this.prisma.board.findFirst({
      where: { id: boardId, workspaceId },
      include: {
        columns: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            name: true,
            position: true,
            tasks: {
              orderBy: { position: 'asc' },
              select: { id: true, columnId: true, title: true, position: true },
            },
          },
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return { id: board.id, name: board.name, description: board.description, columns: board.columns };
  }

  async update(workspaceId: string, boardId: string, dto: UpdateBoardDto): Promise<BoardSummaryDto> {
    await this.assertBoardInWorkspace(workspaceId, boardId);

    return this.prisma.board.update({
      where: { id: boardId },
      data: { name: dto.name, description: dto.description },
      select: SUMMARY_SELECT,
    });
  }

  async remove(workspaceId: string, boardId: string): Promise<void> {
    await this.assertBoardInWorkspace(workspaceId, boardId);
    await this.prisma.board.delete({ where: { id: boardId } });
  }

  private async assertBoardInWorkspace(workspaceId: string, boardId: string): Promise<void> {
    const board = await this.prisma.board.findFirst({ where: { id: boardId, workspaceId }, select: { id: true } });
    if (!board) {
      throw new NotFoundException('Board not found');
    }
  }
}
