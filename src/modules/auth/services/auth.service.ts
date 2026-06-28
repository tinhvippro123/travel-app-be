import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { IUserRepository } from '../../user/interfaces/user-repository.interface.js';
import { IUserService } from '../../user/interfaces/user-service.interface.js';
import { User } from '../../user/entities/user.entity.js';
import { LocalAccount } from '../../user/entities/local-account.entity.js';
import { LoginDto } from '../dto/login.dto.js';
import { RegisterDto } from '../dto/register.dto.js';
import type { JwtPayload } from '../strategies/jwt.strategy.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  /**
   * Đăng nhập — kiểm tra email + password, trả về JWT token.
   */
  async login(dto: LoginDto) {
    // Tìm LocalAccount theo email
    const localAccount = await this.dataSource.manager.findOne(LocalAccount, {
      where: { email: dto.email },
      relations: {
        user: {
          role: true,
        },
      },
    });

    if (!localAccount) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, localAccount.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateToken(localAccount.user);
  }

  /**
   * Đăng ký — tạo user mới và trả về JWT token.
   */
  async register(dto: RegisterDto) {
    const user = await this.userService.registerNewUser(dto);
    // Cần query lại để lấy role nếu registerNewUser chưa gán populate đầy đủ
    const populatedUser = await this.userService.findById(user.id);
    return this.generateToken(populatedUser);
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
    const roleKey = user.role?.key || 'USER';
    
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: roleKey as any,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: roleKey,
      },
    };
  }
}
