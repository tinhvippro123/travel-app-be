import { Otp, OtpType } from '../entities/otp.entity.js';

export abstract class IOtpRepository {
  /**
   * Lưu OTP mới vào database
   */
  abstract saveOtp(target: string, code: string, expiresAt: Date, type: OtpType): Promise<Otp>;

  /**
   * Tìm mã OTP hợp lệ gần nhất theo target và type
   */
  abstract findLatestValidOtp(target: string, type: OtpType): Promise<Otp | null>;

  /**
   * Đánh dấu OTP đã được sử dụng
   */
  abstract markAsUsed(id: string): Promise<void>;

  /**
   * Tăng số lần thử nhập sai OTP
   */
  abstract incrementAttempts(id: string): Promise<void>;

  /**
   * Vô hiệu hoá các OTP cũ trước đó của target
   */
  abstract invalidatePreviousOtps(target: string, type: OtpType): Promise<void>;

  /**
   * Xoá các OTP đã hết hạn hoặc đã sử dụng
   */
  abstract deleteExpired(): Promise<void>;
}
