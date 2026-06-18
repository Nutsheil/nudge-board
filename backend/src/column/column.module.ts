import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';

@Module({
  imports: [AuthModule, CommonModule],
  providers: [ColumnService],
  controllers: [ColumnController],
})
export class ColumnModule {}
