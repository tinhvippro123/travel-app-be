import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  Session,
  ChangePasswordDto,
} from '@modules/auth';
import {
  IUserRepository,
  IUserService,
  User,
  LocalAccount,
  UserResponseDto,
} from '@modules/user';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import type { JwtPayload } from '@modules/auth';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
    @InjectRepository(LocalAccount)
    private readonly localAccountRepo: Repository<LocalAccount>,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}
  /**
   * Đăng nhập — kiểm tra email + password, trả về JWT token.
   */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    // Tìm LocalAccount theo email
    const localAccount = await this.localAccountRepo.findOne({
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
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.userService.registerNewUser(dto);
    // Giải thích: Query lại user bằng findById để load kèm theo entity Role (dùng TypeORM relations),
    // vì hàm registerNewUser chỉ tạo mới user mà chưa populate relation "role".
    // Điều này là bắt buộc để build payload cho JWT token có chứa đúng role.
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
    await this.sessionRepo.update(
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
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Hash JWT bằng SHA256 thay vì bcrypt để có thể tra cứu khi logout/validate
    const crypto = await import('crypto');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    // Tính toán thời gian hết hạn (ví dụ +1 ngày)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);
    const session = this.sessionRepo.create({
      user: user,
      tokenHash: tokenHash,
      status: 'ACTIVE',
      expiresAt: expiresAt,
    });
    await this.sessionRepo.save(session);
    return {
      accessToken: token,
      refreshToken: refreshToken,
      user: new UserResponseDto(user),
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const localAccount = await this.localAccountRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!localAccount) {
      throw new BadRequestException(
        'Tài khoản không được hỗ trợ đổi mật khẩu.',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      localAccount.passwordHash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu cũ không chính xác.');
    }

    const salt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(dto.newPassword, salt);

    await this.localAccountRepo.update(
      { userId: localAccount.userId },
      { passwordHash: newPasswordHash },
    );
  }
}
