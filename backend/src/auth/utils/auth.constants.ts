import type { CookieOptions } from 'express';

export const REFRESH_TOKEN_COOKIE_KEY = 'refreshToken';
export const REFRESH_TOKEN_COOKIE_PATH = '/auth/refresh';

export const BCRYPT_SALT_ROUNDS = 10;

export const buildRefreshCookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: REFRESH_TOKEN_COOKIE_PATH,
  maxAge,
});
