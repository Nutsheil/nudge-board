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
