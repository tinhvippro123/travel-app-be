import { OtpType } from '../entities/otp.entity.js';

export abstract class IOtpService {
  /**
   * Tạo OTP và gửi đến target.
   */
  abstract sendOtp(target: string, type?: OtpType): Promise<void>;

  /**
   * Xác minh OTP; nếu hợp lệ thì xóa OTP khỏi Redis.
   */
  abstract verifyOtp(
    target: string,
    code: string,
    type?: OtpType,
  ): Promise<boolean>;
}
