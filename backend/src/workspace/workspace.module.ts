import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [AuthModule],
  providers: [WorkspaceService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
