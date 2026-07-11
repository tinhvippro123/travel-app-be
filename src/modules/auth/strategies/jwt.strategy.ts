import { IUserService } from '@modules/user';
import { Session } from '@modules/auth';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
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
      console.log('JwtStrategy: Token is missing');
      throw new UnauthorizedException('Token is missing');
    }
    const crypto = await import('crypto');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const session = await this.sessionRepo.findOne({
      where: { tokenHash, status: 'ACTIVE' },
    });
    if (!session) {
      console.log(
        'JwtStrategy: Session is invalid or revoked. Hash:',
        tokenHash,
      );
      throw new UnauthorizedException('Session is invalid or revoked');
    }
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      console.log('JwtStrategy: User not found. Sub:', payload.sub);
      throw new UnauthorizedException('User not found');
    }
    return payload;
  }
}
