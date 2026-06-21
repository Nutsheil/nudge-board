import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { LabelController } from './label.controller';
import { LabelService } from './label.service';

@Module({
  imports: [AuthModule, CommonModule],
  providers: [LabelService],
  controllers: [LabelController],
})
export class LabelModule {}
