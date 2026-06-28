import { IUserService } from '@modules/user/interfaces/index.js';
import { Session } from '@modules/auth/entities/index.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Request } from 'express';
export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
}
/**
 * JWT Strategy — xác thực token từ Authorization header.
 * Passport tự động gọi validate() khi token hợp lệ.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: IUserService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload: JwtPayload) {
    const token = request.headers.authorization?.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    const crypto = await import('crypto');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const session = await this.dataSource.manager.findOne(Session, {
      where: { tokenHash, status: 'ACTIVE' },
    });
    if (!session) {
      throw new UnauthorizedException('Session is invalid or revoked');
    }
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
