import { Body, Controller, Delete, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceMemberGuard } from '../common/guards/workspace-member.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('workspaces/:workspaceId/boards/:boardId')
@UseGuards(JwtAuthGuard, WorkspaceMemberGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('columns/:columnId/tasks')
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.taskService.create(workspaceId, boardId, columnId, dto);
  }

  @Patch('tasks/:taskId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(workspaceId, boardId, taskId, dto);
  }

  @Delete('tasks/:taskId')
  @HttpCode(204)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.taskService.remove(workspaceId, boardId, taskId);
  }

  @Patch('tasks/:taskId/move')
  move(
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
    @Param('taskId') taskId: string,
    @Body() dto: MoveTaskDto,
  ) {
    return this.taskService.move(workspaceId, boardId, taskId, dto);
  }
}
