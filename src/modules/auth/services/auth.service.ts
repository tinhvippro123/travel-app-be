import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserService } from '../../user/interfaces/user-service.interface.js';
import { LoginDto, RegisterDto, TokenResponse } from '../dto/auth.dto.js';
import { IAuthService } from '../interfaces/auth.service.interface.js';
import { ITokenService } from '../interfaces/token.service.interface.js';
import { IHashService } from '../interfaces/hash.service.interface.js';
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: IUserService,
    private readonly tokenService: ITokenService,
    private readonly hashService: IHashService
  ) { }

  /**
   * Đăng nhập — kiểm tra email + password, trả về JWT token.
   */
  async login(dto: LoginDto): Promise<TokenResponse> {
    return new TokenResponse();
  }

  /**
   * Đăng ký — tạo user mới và trả về JWT token.
   */
  async register(dto: RegisterDto): Promise<TokenResponse> {
    //Kiểm tra email tồn tại
    const isExist = await this.userService.existsByEmail(dto.email);

    if (isExist) {
      throw new ConflictException(`Email "${dto.email}" already exists`);
    }
    //Kiểm tra otp mail


    // Hash password
    const hashedPassword = await this.hashService.hash(dto.password);

    const user = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      phone: dto.phone,
    });

    // Tạo token
    const accessToken = await this.tokenService.generateAccessToken({ sub: user.id, version: user.tokenVersion });
    const refreshToken = await this.tokenService.generateRefreshToken();
    return {
      accessToken,
      refreshToken,
    } satisfies TokenResponse;
  }

}
