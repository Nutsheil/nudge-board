import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [AuthModule, CommonModule],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
