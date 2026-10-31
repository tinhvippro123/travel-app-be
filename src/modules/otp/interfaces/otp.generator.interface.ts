export abstract class IOtpGenerator {
  /**
   * Sinh mã OTP ngẫu nhiên (mặc định độ dài 6 chữ số)
   */
  abstract generate(length?: number): string;
}
