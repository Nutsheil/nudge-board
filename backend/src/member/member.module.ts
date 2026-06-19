import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [AuthModule, CommonModule],
  providers: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}
