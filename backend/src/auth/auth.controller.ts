import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';
import ms from 'ms';

import type { Env } from '../config/env.schema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { buildRefreshCookieOptions, REFRESH_TOKEN_COOKIE_KEY } from './utils/auth.constants';

@Controller('auth')
export class AuthController {
  private readonly refreshCookieOptions: CookieOptions;

  constructor(
    private readonly authService: AuthService,
    config: ConfigService<Env, true>,
  ) {
    const jwtRefreshExpiresIn = config.getOrThrow('JWT_REFRESH_EXPIRES_IN', { infer: true });
    const ttl = ms(jwtRefreshExpiresIn);
    this.refreshCookieOptions = buildRefreshCookieOptions(ttl);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.register(dto);
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, this.refreshCookieOptions);
    return { accessToken };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, this.refreshCookieOptions);
    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookies = req.cookies as Record<string, string | undefined>;
    const refreshToken = cookies[REFRESH_TOKEN_COOKIE_KEY];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(refreshToken);
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, newRefreshToken, this.refreshCookieOptions);
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(REFRESH_TOKEN_COOKIE_KEY, { ...this.refreshCookieOptions, maxAge: undefined });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request) {
    return req.user;
  }
}
