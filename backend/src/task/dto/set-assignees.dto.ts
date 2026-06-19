import { IsArray, IsString } from 'class-validator';

export class SetAssigneesDto {
  @IsArray()
  @IsString({ each: true })
  userIds!: string[];
}
