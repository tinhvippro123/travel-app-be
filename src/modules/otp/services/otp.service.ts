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

  constructor(
    private readonly otpRepository: IOtpRepository,
    private readonly otpGenerator: IOtpGenerator,
    private readonly otpDeliveryService: IOtpDeliveryService,
  ) { }

  /**
   * Tạo OTP, lưu vào Redis và gửi qua DeliveryService
   */
  async sendOtp(target: string, type: OtpType = OtpType.REGISTER): Promise<void> {
    const code = this.otpGenerator.generate(6);

    const ttlSeconds = this.OTP_EXPIRY_MINUTES * 60;

    await this.otpRepository.saveOtp(target, code, type, ttlSeconds);

    // 4. Gửi mã OTP qua email hoặc SMS
    await this.otpDeliveryService.sendOtp(target, code, { type });

    this.logger.log(`Generated and dispatched OTP to ${target} (type: ${type})`);
  }

  /**
   * Xác minh mã OTP hợp lệ và xóa khỏi Redis sau khi sử dụng thành công
   */
  async verifyOtp(target: string, code: string, type: OtpType = OtpType.REGISTER): Promise<boolean> {
    const record = await this.otpRepository.findOtp(target, type);

    if (!record) {
      throw new BadRequestException('Mã OTP không hợp lệ hoặc đã hết hạn');
    }

    if (record.code !== code) {
      throw new BadRequestException('Mã OTP không chính xác');
    }
    await this.otpRepository.deleteOtp(target, type);
    return true;
  }
}
