import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { buildCorsConfig } from './config/cors.config';
import type { Env } from './config/env.schema';
import { validationConfig } from './config/validation.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: ConfigService<Env, true> = app.get(ConfigService);

  const port = config.getOrThrow('PORT', { infer: true });

  app.enableCors(buildCorsConfig(config));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe(validationConfig));
  app.enableShutdownHooks();

  await app.listen(port, () => console.log(`Server started on port ${port}`));
}
void bootstrap();
