import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  otp: string;
}

export class JwtPayload {
  @IsString()
  sub: string;

  @IsNumber()
  version: number;
}

export class TokenResponse {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}