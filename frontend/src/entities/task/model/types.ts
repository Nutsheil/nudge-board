import type { Priority } from '@/entities/board'

export interface TaskDetailAssignee {
  id: string
  name: string
  email: string
}

export interface TaskDetail {
  id: string
  columnId: string
  title: string
  description: string | null
  position: number
  priority: Priority
  timeEstimate: number | null
  timeSpent: number
  dueDate: string | null
  assignees: TaskDetailAssignee[]
}
