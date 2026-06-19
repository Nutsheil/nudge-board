import type { Priority } from '../../../generated/prisma/client';

export interface BoardSummaryDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

export interface BoardAssigneeDto {
  id: string;
  name: string;
}

export interface BoardTaskDto {
  id: string;
  columnId: string;
  title: string;
  position: number;
  priority: Priority;
  dueDate: Date | null;
  assignees: BoardAssigneeDto[];
}

export interface BoardColumnDto {
  id: string;
  name: string;
  position: number;
  tasks: BoardTaskDto[];
}

export interface BoardTreeDto {
  id: string;
  name: string;
  description: string | null;
  columns: BoardColumnDto[];
}
