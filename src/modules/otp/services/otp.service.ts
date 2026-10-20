import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IOtpService } from '../interfaces/otp.service.interface.js';
import { IOtpRepository } from '../interfaces/otp.repository.interface.js';
import { IOtpGenerator } from '../interfaces/otp.generator.interface.js';
import { IOtpDeliveryService } from '../interfaces/otp.delivery.interface.js';
import { OtpType } from '../entities/otp.entity.js';

@Injectable()
export class OtpService implements IOtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly MAX_ATTEMPTS = 5;

  constructor(
    private readonly otpRepository: IOtpRepository,
    private readonly otpGenerator: IOtpGenerator,
    private readonly otpDeliveryService: IOtpDeliveryService,
  ) {}

  /**
   * Điều phối tạo OTP, lưu vào repository và gửi qua DeliveryService
   */
  async sendOtp(target: string, type: OtpType = OtpType.REGISTER): Promise<void> {
    // 1. Vô hiệu hoá các OTP trước đó chưa sử dụng
    await this.otpRepository.invalidatePreviousOtps(target, type);

    // 2. Sinh mã OTP ngẫu nhiên (6 chữ số)
    const code = this.otpGenerator.generate(6);

    // 3. Tính thời gian hết hạn (5 phút)
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    // 4. Lưu OTP vào database
    await this.otpRepository.saveOtp(target, code, expiresAt, type);

    // 5. Gửi mã OTP qua email hoặc SMS
    await this.otpDeliveryService.sendOtp(target, code, { type });

    this.logger.log(`Generated and dispatched OTP to ${target} (type: ${type})`);
  }

  /**
   * Xác minh mã OTP hợp lệ và đánh dấu đã sử dụng
   */
  async verifyOtp(target: string, code: string, type: OtpType = OtpType.REGISTER): Promise<boolean> {
    const record = await this.otpRepository.findLatestValidOtp(target, type);

    if (!record) {
      throw new BadRequestException('Mã OTP không hợp lệ hoặc đã hết hạn');
    }

    if (record.attempts >= this.MAX_ATTEMPTS) {
      throw new BadRequestException('Mã OTP đã vượt quá số lần thử tối đa');
    }

    if (record.code !== code) {
      await this.otpRepository.incrementAttempts(record.id);
      throw new BadRequestException('Mã OTP không chính xác');
    }

    // Đánh dấu mã OTP đã được sử dụng thành công
    await this.otpRepository.markAsUsed(record.id);
    return true;
  }

  /**
   * Dọn dẹp các OTP hết hạn
   */
  async cleanExpiredOtps(): Promise<void> {
    await this.otpRepository.deleteExpired();
  }
}
