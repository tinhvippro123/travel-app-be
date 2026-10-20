import { Body, Controller, Post } from '@nestjs/common';
import { IOtpService } from '../interfaces/otp.service.interface.js';
import { SendOtpDto } from '../dto/send-otp.dto.js';
import { VerifyOtpDto } from '../dto/verify-otp.dto.js';
import { Public } from '../../auth/decorators/public.decorator.js';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: IOtpService) {}

  @Public()
  @Post('send')
  async sendOtp(@Body() dto: SendOtpDto) {
    await this.otpService.sendOtp(dto.target, dto.type);
    return {
      message: 'Mã OTP đã được gửi thành công',
    };
  }

  @Public()
  @Post('verify')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const isValid = await this.otpService.verifyOtp(dto.target, dto.code, dto.type);
    return {
      valid: isValid,
      message: 'Xác thực mã OTP thành công',
    };
  }
}
