import { IsString, ValidateIf } from 'class-validator';

export class MoveColumnDto {
  // afterId must be present in the body; `null` means "move to the first slot".
  @ValidateIf((o: MoveColumnDto) => o.afterId !== null)
  @IsString()
  afterId!: string | null;
}
