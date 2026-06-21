import type { LabelColor } from '../../../generated/prisma/client';

export interface LabelDto {
  id: string;
  name: string;
  color: LabelColor;
}
