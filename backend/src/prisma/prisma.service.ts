import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../generated/prisma/client';
import type { Env } from '../config/env.schema';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(config: ConfigService<Env, true>) {
    const connectionString = config.getOrThrow('DATABASE_URL', { infer: true });

    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
