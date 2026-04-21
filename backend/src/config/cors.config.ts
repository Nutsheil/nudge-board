import { type CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { type ConfigService } from '@nestjs/config';

import type { Env } from './env.schema';

export const buildCorsConfig = (config: ConfigService<Env, true>): CorsOptions => {
  const corsOrigin = config.getOrThrow('CORS_ORIGIN', { infer: true });

  return {
    origin: corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  };
};
