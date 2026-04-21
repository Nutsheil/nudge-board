import ms, { type StringValue } from 'ms';
import { z } from 'zod';

const msDuration = z
  .string()
  .refine((v) => ms(v as StringValue) !== undefined, {
    message: 'Invalid duration (expected ms format, e.g. "5m", "10h", "3d", etc)',
  })
  .transform((v) => v as StringValue);

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  CORS_ORIGIN: z.string().min(1),
  DATABASE_URL: z.url(),

  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES_IN: msDuration,
  JWT_REFRESH_EXPIRES_IN: msDuration,
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (raw: Record<string, unknown>): Env => {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return result.data;
};
