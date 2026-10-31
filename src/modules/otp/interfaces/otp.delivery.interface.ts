export abstract class IOtpDeliveryService {
  /**
   * Gửi OTP qua email hoặc SMS
   * @param target Email hoặc số điện thoại người nhận
   * @param otp Mã OTP
   * @param context Thông tin mở rộng (loại OTP, subject, metadata...)
   */
  abstract sendOtp(
    target: string,
    otp: string,
    context?: Record<string, any>,
  ): Promise<void>;
}
