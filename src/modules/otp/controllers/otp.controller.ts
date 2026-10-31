import { Body, Controller, Post } from '@nestjs/common';
import { IOtpService } from '../interfaces/otp.service.interface.js';
import { SendOtpDto } from '../dto/send-otp.dto.js';
import { VerifyOtpDto } from '../dto/verify-otp.dto.js';
import { Public } from '../../auth/decorators/public.decorator.js';
import { OtpType } from '../entities/otp.entity.js';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: IOtpService) {}

  /**
   * Endpoint gửi mã OTP (hiện tại ưu tiên hỗ trợ quy trình đăng ký tài khoản)
   */
  @Public()
  @Post('send')
  async sendOtp(@Body() dto: SendOtpDto) {
    const type = dto.type ?? OtpType.REGISTER;
    await this.otpService.sendOtp(dto.target, type);
    return {
      message: 'Mã OTP đã được gửi thành công',
    };
  }

  /**
   * Endpoint kiểm tra xác thực mã OTP khi người dùng đăng ký
   */
  @Public()
  @Post('verify')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const type = dto.type ?? OtpType.REGISTER;
    const isValid = await this.otpService.verifyOtp(dto.target, dto.code, type);
    return {
      valid: isValid,
      message: 'Xác thực mã OTP thành công',
    };
  }
}
