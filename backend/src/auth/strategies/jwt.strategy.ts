import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { Env } from '../../config/env.schema';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    config: ConfigService<Env, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_ACCESS_SECRET', { infer: true }),
    });
  }

  async validate(payload: JwtPayload) {
    // TODO: Делает запрос в БД на каждый запрос. Под нагрузкой станет узким местом
    return await this.authService.validate(payload);
  }
}
