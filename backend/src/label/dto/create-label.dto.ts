import { Transform } from 'class-transformer';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

import { LabelColor } from '../../../generated/prisma/client';

export class CreateLabelDto {
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name!: string;

  @IsEnum(LabelColor)
  color!: LabelColor;
}
