import { OtpType } from '../entities/otp.entity.js';

export abstract class IOtpService {
  /**
   * Điều phối tạo OTP, lưu vào repository và gửi qua DeliveryService
   */
  abstract sendOtp(target: string, type?: OtpType): Promise<void>;

  /**
   * Xác minh mã OTP hợp lệ và đánh dấu đã sử dụng
   */
  abstract verifyOtp(target: string, code: string, type?: OtpType): Promise<boolean>;

  /**
   * Dọn dẹp các OTP đã hết hạn
   */
  abstract cleanExpiredOtps(): Promise<void>;
}
