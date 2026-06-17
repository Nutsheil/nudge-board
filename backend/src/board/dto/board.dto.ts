export interface BoardSummaryDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

export interface BoardColumnDto {
  id: string;
  name: string;
  position: number;
}

export interface BoardTreeDto {
  id: string;
  name: string;
  description: string | null;
  columns: BoardColumnDto[];
}
