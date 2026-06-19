import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';

import { Priority } from '../../../generated/prisma/client';

export class UpdateTaskDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  // null clears the description; undefined leaves it untouched.
  @IsOptional()
  @ValidateIf((o: UpdateTaskDto) => o.description !== null)
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @ValidateIf((o: UpdateTaskDto) => o.timeEstimate !== null)
  @IsInt()
  @Min(0)
  timeEstimate?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpent?: number;

  @IsOptional()
  @ValidateIf((o: UpdateTaskDto) => o.dueDate !== null)
  @IsDateString()
  dueDate?: string | null;
}
