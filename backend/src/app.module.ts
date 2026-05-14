import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { validateEnv } from './config/env.schema';
import { PrismaModule } from './prisma/prisma.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }), PrismaModule, AuthModule, WorkspaceModule],
})
export class AppModule {}
