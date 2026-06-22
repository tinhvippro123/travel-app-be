import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IUserRepository } from '../../user/interfaces/user-repository.interface.js';
import { IUserService } from '../../user/interfaces/user-service.interface.js';
import { User } from '../../user/entities/user.entity.js';
import { LoginDto } from '../dto/login.dto.js';
import { RegisterDto } from '../dto/register.dto.js';
import type { JwtPayload } from '../strategies/jwt.strategy.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Đăng nhập — kiểm tra email + password, trả về JWT token.
   */
  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateToken(user);
  }

  /**
   * Đăng ký — tạo user mới và trả về JWT token.
   */
  async register(dto: RegisterDto) {
    const user = await this.userService.create({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      phone: dto.phone,
    });

    return this.generateToken(user);
  }

  /**
   * Lấy profile user hiện tại từ JWT payload.
   */
  async getProfile(userId: string) {
    return this.userService.findById(userId);
  }

  /**
   * Tạo JWT token từ user entity.
   */
  private generateToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
