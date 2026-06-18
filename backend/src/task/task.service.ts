import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { MoveTaskDto } from './dto/move-task.dto';
import type { TaskDto } from './dto/task.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';

const TASK_SELECT = { id: true, columnId: true, title: true, position: true } as const;
const POSITION_EPSILON = 1e-6;

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, boardId: string, columnId: string, dto: CreateTaskDto): Promise<TaskDto> {
    await this.assertColumnInBoard(workspaceId, boardId, columnId);

    const last = await this.prisma.task.findFirst({
      where: { columnId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const position = last ? last.position + 1 : 1;

    return this.prisma.task.create({
      data: { columnId, title: dto.title, position },
      select: TASK_SELECT,
    });
  }

  async update(workspaceId: string, boardId: string, taskId: string, dto: UpdateTaskDto): Promise<TaskDto> {
    await this.assertTaskInBoard(workspaceId, boardId, taskId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: { title: dto.title },
      select: TASK_SELECT,
    });
  }

  async remove(workspaceId: string, boardId: string, taskId: string): Promise<void> {
    await this.assertTaskInBoard(workspaceId, boardId, taskId);
    await this.prisma.task.delete({ where: { id: taskId } });
  }

  async move(workspaceId: string, boardId: string, taskId: string, dto: MoveTaskDto): Promise<TaskDto> {
    await this.assertTaskInBoard(workspaceId, boardId, taskId);
    await this.assertColumnInBoard(workspaceId, boardId, dto.targetColumnId);

    const tasks = await this.prisma.task.findMany({
      where: { columnId: dto.targetColumnId },
      orderBy: { position: 'asc' },
      select: { id: true, position: true },
    });

    const others = tasks.filter((t) => t.id !== taskId);
    const { afterId, targetColumnId } = dto;

    if (afterId !== null && !others.some((t) => t.id === afterId)) {
      throw new NotFoundException('Anchor task not found');
    }

    const prevIndex = afterId === null ? -1 : others.findIndex((t) => t.id === afterId);
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
      return this.rebalanceAndPlace(others, taskId, prevIndex, targetColumnId);
    } else {
      position = (prev.position + next.position) / 2;
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { columnId: targetColumnId, position },
      select: TASK_SELECT,
    });
  }

  private async rebalanceAndPlace(
    others: { id: string }[],
    taskId: string,
    prevIndex: number,
    targetColumnId: string,
  ): Promise<TaskDto> {
    const orderedIds = others.map((t) => t.id);
    orderedIds.splice(prevIndex + 1, 0, taskId);

    const updates = orderedIds.map((id, i) =>
      this.prisma.task.update({
        where: { id },
        data: id === taskId ? { columnId: targetColumnId, position: i + 1 } : { position: i + 1 },
        select: TASK_SELECT,
      }),
    );
    const results = await this.prisma.$transaction(updates);
    return results.find((t) => t.id === taskId) as TaskDto;
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

  private async assertTaskInBoard(workspaceId: string, boardId: string, taskId: string): Promise<void> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, column: { boardId, board: { workspaceId } } },
      select: { id: true },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
  }
}
