import { Body, Controller, Delete, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceMemberGuard } from '../common/guards/workspace-member.guard';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { MoveColumnDto } from './dto/move-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('workspaces/:workspaceId/boards/:boardId/columns')
@UseGuards(JwtAuthGuard, WorkspaceMemberGuard)
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
    @Body() dto: CreateColumnDto,
  ) {
    return this.columnService.create(workspaceId, boardId, dto);
  }

  @Patch(':columnId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() dto: UpdateColumnDto,
  ) {
    return this.columnService.update(workspaceId, boardId, columnId, dto);
  }

  @Patch(':columnId/move')
  move(
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() dto: MoveColumnDto,
  ) {
    return this.columnService.move(workspaceId, boardId, columnId, dto);
  }

  @Delete(':columnId')
  @HttpCode(204)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
  ) {
    return this.columnService.remove(workspaceId, boardId, columnId);
  }
}
