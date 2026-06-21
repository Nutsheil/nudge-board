import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceMemberGuard } from '../common/guards/workspace-member.guard';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { LabelService } from './label.service';

@Controller('workspaces/:workspaceId/labels')
@UseGuards(JwtAuthGuard, WorkspaceMemberGuard)
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Get()
  list(@Param('workspaceId') workspaceId: string) {
    return this.labelService.list(workspaceId);
  }

  @Post()
  create(@Param('workspaceId') workspaceId: string, @Body() dto: CreateLabelDto) {
    return this.labelService.create(workspaceId, dto);
  }

  @Patch(':labelId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('labelId') labelId: string,
    @Body() dto: UpdateLabelDto,
  ) {
    return this.labelService.update(workspaceId, labelId, dto);
  }

  @Delete(':labelId')
  @HttpCode(204)
  remove(@Param('workspaceId') workspaceId: string, @Param('labelId') labelId: string) {
    return this.labelService.remove(workspaceId, labelId);
  }
}
