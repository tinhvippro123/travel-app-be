import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../../../infrastructure/mail/mail.service.js';
import { IOtpDeliveryService } from '../interfaces/otp.delivery.interface.js';

@Injectable()
export class OtpDeliveryService implements IOtpDeliveryService {
  private readonly logger = new Logger(OtpDeliveryService.name);

  constructor(private readonly mailService: MailService) {}

  async sendOtp(target: string, otp: string): Promise<void> {
    const subject = 'Mã xác thực OTP của bạn';

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb; margin-top: 0;">Xác thực mã OTP</h2>
        <p>Xin chào,</p>
        <p>Mã xác thực OTP của bạn là:</p>

        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; background-color: #f3f4f6; padding: 12px 24px; border-radius: 6px; color: #1e40af; border: 1px dashed #93c5fd;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          Mã này có hiệu lực trong vòng 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai để bảo vệ tài khoản của bạn.
        </p>
      </div>
    `;

    await this.mailService.sendMail(target, subject, html);

    this.logger.log(`Sent OTP email to ${target}`);
  }
}
