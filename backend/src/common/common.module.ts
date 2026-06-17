import { Module } from '@nestjs/common';

import { WorkspaceMemberGuard } from './guards/workspace-member.guard';

@Module({
  providers: [WorkspaceMemberGuard],
  exports: [WorkspaceMemberGuard],
})
export class CommonModule {}
