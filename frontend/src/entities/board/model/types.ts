export interface Board {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export interface BoardColumn {
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
