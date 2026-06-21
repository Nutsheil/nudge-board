import type { LabelColor, Priority } from '../../../generated/prisma/client';

export interface AssigneeDto {
  id: string;
  name: string;
  email: string;
}

export interface TaskLabelDto {
  id: string;
  name: string;
  color: LabelColor;
}

export interface TaskDetailDto {
  id: string;
  columnId: string;
  title: string;
  description: string | null;
  position: number;
  priority: Priority;
  timeEstimate: number | null;
  timeSpent: number;
  dueDate: Date | null;
  assignees: AssigneeDto[];
  labels: TaskLabelDto[];
}
