import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserService } from '../../user/interfaces/user-service.interface.js';
import { LoginDto, RegisterDto, TokenResponse } from '../dto/auth.dto.js';
import { IAuthService } from '../interfaces/auth.service.interface.js';
import { ITokenService } from '../interfaces/token.service.interface.js';
import { IHashService } from '../interfaces/hash.service.interface.js';
import { IOtpService } from '../../otp/interfaces/otp.service.interface.js';
import { OtpType } from '../../otp/entities/otp.entity.js';
import { MailService } from '../../../infrastructure/mail/mail.service.js';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: IUserService,
    private readonly tokenService: ITokenService,
    private readonly hashService: IHashService,
    private readonly otpService: IOtpService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Đăng nhập — kiểm tra email + password, trả về JWT token.
   */
  login(dto: LoginDto): Promise<TokenResponse> {
    // Login is still a placeholder in this registration PR.
    void dto;
    return Promise.resolve(new TokenResponse());
  }

  /**
   * Đăng ký — tạo user mới và trả về JWT token.
   */
  async register(dto: RegisterDto): Promise<TokenResponse> {
    // Kiểm tra email tồn tại
    const isExist = await this.userService.existsByEmail(dto.email);

    if (isExist) {
      await this.sendAccountAlreadyExistsEmail(dto.email);
      throw new UnauthorizedException(`Email "${dto.email}" already exists`);
    }

    // Kiểm tra otp mail
    const isOtpValid = await this.otpService.verifyOtp(
      dto.email,
      dto.otp,
      OtpType.REGISTER,
    );

    if (!isOtpValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Hash password
    const hashedPassword = await this.hashService.hash(dto.password);

    const user = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      phone: dto.phone,
    });

    // Tạo token
    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      version: user.tokenVersion,
    });
    const refreshToken = await this.tokenService.generateRefreshToken();
    return {
      accessToken,
      refreshToken,
    } satisfies TokenResponse;
  }

  /**
   * Helper gửi email thông báo khi email đã tồn tại trong hệ thống,
   * yêu cầu người dùng liên hệ bộ phận hỗ trợ hoặc khôi phục mật khẩu.
   */
  private async sendAccountAlreadyExistsEmail(email: string): Promise<void> {
    const subject = 'Thông báo: Yêu cầu đăng ký tài khoản với email đã tồn tại';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 550px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #dc2626; margin-top: 0;">Thông báo đăng ký tài khoản</h2>
        <p>Xin chào,</p>
        <p>Hệ thống nhận thấy có yêu cầu đăng ký tài khoản mới bằng địa chỉ email <strong>${email}</strong>.</p>
        <p>Tuy nhiên, địa chỉ email này <strong>đã được đăng ký</strong> trong hệ thống từ trước.</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; color: #991b1b; font-size: 14px;">
            Nếu bạn là chủ tài khoản, vui lòng đăng nhập hoặc sử dụng chức năng <em>"Quên mật khẩu"</em> để truy cập.
          </p>
        </div>

        <p style="font-size: 14px; line-height: 1.6;">
          Nếu bạn không thực hiện yêu cầu này hoặc cần hỗ trợ thêm về tài khoản, vui lòng liên hệ với bộ phận hỗ trợ khách hàng của hệ thống để được giải quyết:
        </p>
        <ul style="font-size: 14px; color: #4b5563;">
          <li>Email hỗ trợ: <strong>support@travelapp.com</strong></li>
          <li>Hotline hỗ trợ: <strong>1900 xxxx</strong></li>
        </ul>

        <p style="font-size: 13px; color: #6b7280; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px;">
          Trân trọng,<br>Đội ngũ hỗ trợ hệ thống Travel App
        </p>
      </div>
    `;

    await this.mailService.sendMail(email, subject, html);
  }
}
