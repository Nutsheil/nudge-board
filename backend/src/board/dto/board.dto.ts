export interface BoardSummaryDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

export interface BoardTaskDto {
  id: string;
  columnId: string;
  title: string;
  position: number;
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
