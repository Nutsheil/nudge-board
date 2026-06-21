import { Injectable, NotFoundException } from '@nestjs/common';

import type { Priority } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { MoveTaskDto } from './dto/move-task.dto';
import type { SetAssigneesDto } from './dto/set-assignees.dto';
import type { SetLabelsDto } from './dto/set-labels.dto';
import type { TaskDto } from './dto/task.dto';
import type { AssigneeDto, TaskDetailDto, TaskLabelDto } from './dto/task-detail.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';

const TASK_SELECT = { id: true, columnId: true, title: true, position: true } as const;
const CARD_SELECT = { id: true, columnId: true, title: true, position: true, priority: true, dueDate: true } as const;
const POSITION_EPSILON = 1e-6;

const DETAIL_SELECT = {
  id: true,
  columnId: true,
  title: true,
  description: true,
  position: true,
  priority: true,
  timeEstimate: true,
  timeSpent: true,
  dueDate: true,
  assignees: { select: { user: { select: { id: true, name: true, email: true } } } },
  labels: { select: { label: { select: { id: true, name: true, color: true } } } },
} as const;

type DetailRow = {
  id: string;
  columnId: string;
  title: string;
  description: string | null;
  position: number;
  priority: Priority;
  timeEstimate: number | null;
  timeSpent: number;
  dueDate: Date | null;
  assignees: { user: AssigneeDto }[];
  labels: { label: TaskLabelDto }[];
};

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    boardId: string,
    columnId: string,
    dto: CreateTaskDto,
  ): Promise<{ id: string; columnId: string; title: string; position: number; priority: Priority; dueDate: Date | null }> {
    await this.assertColumnInBoard(workspaceId, boardId, columnId);

    const last = await this.prisma.task.findFirst({
      where: { columnId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const position = last ? last.position + 1 : 1;

    return this.prisma.task.create({
      data: { columnId, title: dto.title, position },
      select: CARD_SELECT,
    });
  }

  async update(workspaceId: string, boardId: string, taskId: string, dto: UpdateTaskDto): Promise<TaskDetailDto> {
    await this.assertTaskInBoard(workspaceId, boardId, taskId);

    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.timeEstimate !== undefined) data.timeEstimate = dto.timeEstimate;
    if (dto.timeSpent !== undefined) data.timeSpent = dto.timeSpent;
    if (dto.dueDate !== undefined) data.dueDate = dto.dueDate === null ? null : new Date(dto.dueDate);

    const row = (await this.prisma.task.update({
      where: { id: taskId },
      data,
      select: DETAIL_SELECT,
    })) as unknown as DetailRow;

    return this.toDetail(row);
  }

  private toDetail(row: DetailRow): TaskDetailDto {
    return {
      id: row.id,
      columnId: row.columnId,
      title: row.title,
      description: row.description,
      position: row.position,
      priority: row.priority,
      timeEstimate: row.timeEstimate,
      timeSpent: row.timeSpent,
      dueDate: row.dueDate,
      assignees: row.assignees.map((a) => a.user),
      labels: row.labels.map((l) => l.label),
    };
  }

  async getTask(workspaceId: string, boardId: string, taskId: string): Promise<TaskDetailDto> {
    await this.assertTaskInBoard(workspaceId, boardId, taskId);

    const row = (await this.prisma.task.findFirst({
      where: { id: taskId },
      select: DETAIL_SELECT,
    })) as DetailRow;

    return this.toDetail(row);
  }

  async setAssignees(
    workspaceId: string,
    boardId: string,
    taskId: string,
    dto: SetAssigneesDto,
  ): Promise<AssigneeDto[]> {
    await this.assertTaskInBoard(workspaceId, boardId, taskId);

    const userIds = [...new Set(dto.userIds)];
    if (userIds.length > 0) {
      const members = await this.prisma.workspaceMember.findMany({
        where: { workspaceId, userId: { in: userIds } },
        select: { userId: true },
      });
      if (members.length !== userIds.length) {
        throw new NotFoundException('Member not found');
      }
    }

    await this.prisma.$transaction([
      this.prisma.taskAssignee.deleteMany({ where: { taskId } }),
      this.prisma.taskAssignee.createMany({ data: userIds.map((userId) => ({ taskId, userId })) }),
    ]);

    const rows = await this.prisma.taskAssignee.findMany({
      where: { taskId },
      select: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { assignedAt: 'asc' },
    });
    return rows.map((r) => r.user);
  }

  async setLabels(
    workspaceId: string,
    boardId: string,
    taskId: string,
    dto: SetLabelsDto,
  ): Promise<TaskLabelDto[]> {
    await this.assertTaskInBoard(workspaceId, boardId, taskId);

    const labelIds = [...new Set(dto.labelIds)];
    if (labelIds.length > 0) {
      const labels = await this.prisma.label.findMany({
        where: { workspaceId, id: { in: labelIds } },
        select: { id: true },
      });
      if (labels.length !== labelIds.length) {
        throw new NotFoundException('Label not found');
      }
    }

    await this.prisma.$transaction([
      this.prisma.taskLabel.deleteMany({ where: { taskId } }),
      this.prisma.taskLabel.createMany({ data: labelIds.map((labelId) => ({ taskId, labelId })) }),
    ]);

    const rows = await this.prisma.taskLabel.findMany({
      where: { taskId },
      select: { label: { select: { id: true, name: true, color: true } } },
      orderBy: { label: { name: 'asc' } },
    });
    return rows.map((r) => r.label);
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
