import type { LabelColor } from '@/entities/label'

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface TaskAssigneeView {
  id: string
  name: string
}

export interface LabelView {
  id: string
  name: string
  color: LabelColor
}

export interface Board {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export interface BoardTask {
  id: string
  columnId: string
  title: string
  position: number
  priority: Priority
  dueDate: string | null
  assignees: TaskAssigneeView[]
  labels: LabelView[]
}

export interface BoardColumn {
  id: string
  name: string
  position: number
  tasks: BoardTask[]
}

// Server response for column mutations — the column row without its nested tasks.
export interface ColumnEntity {
  id: string
  name: string
  position: number
}

export interface BoardTree {
  id: string
  name: string
  description: string | null
  columns: BoardColumn[]
}
