import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';

import type { Env } from '../config/env.schema';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './interfaces/jwt.interface';
import { BCRYPT_SALT_ROUNDS } from './utils/auth.constants';

@Injectable()
export class AuthService {
  private readonly jwtAccessExpiresIn: StringValue;
  private readonly jwtRefreshExpiresIn: StringValue;
  private readonly jwtRefreshSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    config: ConfigService<Env, true>,
  ) {
    this.jwtAccessExpiresIn = config.getOrThrow('JWT_ACCESS_EXPIRES_IN', { infer: true });
    this.jwtRefreshExpiresIn = config.getOrThrow('JWT_REFRESH_EXPIRES_IN', { infer: true });
    this.jwtRefreshSecret = config.getOrThrow('JWT_REFRESH_SECRET', { infer: true });
  }

  async register(dto: RegisterDto) {
    const { email, name, password } = dto;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: { email, name, password: passwordHashed },
      select: { id: true },
    });

    return this.generateTokens(user.id);
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email }, select: { id: true, password: true } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id);
  }

  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, { secret: this.jwtRefreshSecret });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true } });
    if (!user) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return this.generateTokens(user.id);
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private generateTokens(userId: string) {
    const payload: JwtPayload = { sub: userId };

    const accessToken = this.jwt.sign(payload, { expiresIn: this.jwtAccessExpiresIn });
    const refreshToken = this.jwt.sign(payload, { expiresIn: this.jwtRefreshExpiresIn, secret: this.jwtRefreshSecret });

    return { accessToken, refreshToken };
  }
}
