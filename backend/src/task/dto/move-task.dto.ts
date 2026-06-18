import { IsString, ValidateIf } from 'class-validator';

export class MoveTaskDto {
  @IsString()
  targetColumnId!: string;

  // afterId must be present in the body; `null` means "move to the first slot".
  @ValidateIf((o: MoveTaskDto) => o.afterId !== null)
  @IsString()
  afterId!: string | null;
}
