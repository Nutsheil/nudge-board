import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceMemberGuard } from '../common/guards/workspace-member.guard';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('workspaces/:workspaceId/boards')
@UseGuards(JwtAuthGuard, WorkspaceMemberGuard)
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  list(@Param('workspaceId') workspaceId: string) {
    return this.boardService.list(workspaceId)
  }

  @Post()
  create(@Param('workspaceId') workspaceId: string, @Body() dto: CreateBoardDto) {
    return this.boardService.create(workspaceId, dto)
  }

  @Get(':boardId')
  getBoard(@Param('workspaceId') workspaceId: string, @Param('boardId') boardId: string) {
    return this.boardService.getBoard(workspaceId, boardId)
  }

  @Patch(':boardId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.boardService.update(workspaceId, boardId, dto)
  }

  @Delete(':boardId')
  @HttpCode(204)
  remove(@Param('workspaceId') workspaceId: string, @Param('boardId') boardId: string) {
    return this.boardService.remove(workspaceId, boardId)
  }
}
