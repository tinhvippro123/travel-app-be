import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OtpType } from '../entities/otp.entity.js';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  target: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(OtpType)
  @IsOptional()
  type?: OtpType;
}
