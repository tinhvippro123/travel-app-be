import {
  IUserRepository,
  IUserService,
} from '@modules/user/interfaces/index.js';
import { User, LocalAccount } from '@modules/user/entities/index.js';
import { LoginDto, RegisterDto } from '@modules/auth/dto/index.js';
import { Session } from '@modules/auth/entities/index.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
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
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      localAccount.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return await this.generateToken(localAccount.user);
  }
  /**
   * Đăng ký — tạo user mới và trả về JWT token.
   */
  async register(dto: RegisterDto) {
    const user = await this.userService.registerNewUser(dto);
    // Cần query lại để lấy role nếu registerNewUser chưa gán populate đầy đủ
    const populatedUser = await this.userService.findById(user.id);
    return await this.generateToken(populatedUser);
  }
  async getProfile(userId: string) {
    return this.userService.findById(userId);
  }
  /**
   * Đăng xuất — revoke session hiện tại.
   */
  async logout(token: string) {
    const crypto = await import('crypto');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await this.dataSource.manager.update(
      Session,
      { tokenHash: tokenHash, status: 'ACTIVE' },
      { status: 'REVOKED', revokedAt: new Date() },
    );
  }
  /**
   * Tạo JWT token từ user entity và lưu vào database.
   */
  private async generateToken(user: User) {
    const roleKey = user.role?.key || 'USER';
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: roleKey,
    };
    const token = this.jwtService.sign(payload);
    // Hash JWT bằng SHA256 thay vì bcrypt để có thể tra cứu khi logout/validate
    const crypto = await import('crypto');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    // Tính toán thời gian hết hạn (ví dụ +1 ngày)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);
    const session = this.dataSource.manager.create(Session, {
      user: user,
      tokenHash: tokenHash,
      status: 'ACTIVE',
      expiresAt: expiresAt,
    });
    await this.dataSource.manager.save(session);
    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: roleKey,
      },
    };
  }
}
