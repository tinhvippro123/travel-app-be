import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OtpType } from '../entities/otp.entity.js';

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  target: string;

  @IsEnum(OtpType)
  @IsOptional()
  type?: OtpType = OtpType.REGISTER;
}
