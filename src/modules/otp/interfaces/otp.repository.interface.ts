import { Otp, OtpType } from '../entities/otp.entity.js';

export abstract class IOtpRepository {
  /**
   * Lưu OTP vào Redis với thời gian hết hạn (giây).
   */
  abstract saveOtp(
    target: string,
    code: string,
    type: OtpType,
    ttl: number,
  ): Promise<void>;

  /**
   * Lấy OTP theo target và type.
   */
  abstract findOtp(target: string, type: OtpType): Promise<Otp | null>;

  /**
   * Xóa OTP sau khi xác thực thành công.
   */
  abstract deleteOtp(target: string, type: OtpType): Promise<void>;
}
