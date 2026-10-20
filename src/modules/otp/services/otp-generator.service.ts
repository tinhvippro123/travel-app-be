import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IOtpGenerator } from '../interfaces/otp.generator.interface.js';

@Injectable()
export class OtpGeneratorService implements IOtpGenerator {
  /**
   * Sinh mã số OTP ngẫu nhiên bằng crypto an toàn
   */
  generate(length = 6): string {
    const digits = '0123456789';
    let otp = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      otp += digits[randomBytes[i] % 10];
    }
    return otp;
  }
}
