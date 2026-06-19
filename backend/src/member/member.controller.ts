import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceMemberGuard } from '../common/guards/workspace-member.guard';
import { MemberService } from './member.service';

@Controller('workspaces/:workspaceId/members')
@UseGuards(JwtAuthGuard, WorkspaceMemberGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  list(@Param('workspaceId') workspaceId: string) {
    return this.memberService.list(workspaceId);
  }
}
