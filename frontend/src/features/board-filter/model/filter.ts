import type { BoardTask, Priority } from '@/entities/board'

export interface BoardFilterState {
  labelIds: string[]
  priorities: Priority[]
}

export const EMPTY_FILTER: BoardFilterState = { labelIds: [], priorities: [] }

export const isFilterActive = (state: BoardFilterState): boolean =>
  state.labelIds.length > 0 || state.priorities.length > 0

export const matchesFilter = (task: BoardTask, state: BoardFilterState): boolean => {
  const labelOk =
    state.labelIds.length === 0 || task.labels.some((l) => state.labelIds.includes(l.id))
  const priorityOk = state.priorities.length === 0 || state.priorities.includes(task.priority)
  return labelOk && priorityOk
}
