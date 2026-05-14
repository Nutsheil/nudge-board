import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspaceService } from './workspace.service';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  list(@Req() req: Request) {
    const { id } = req.user as { id: string };
    return this.workspaceService.list(id);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateWorkspaceDto) {
    const { id } = req.user as { id: string };
    return this.workspaceService.create(id, dto);
  }
}
