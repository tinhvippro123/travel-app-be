import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  facebook?: string;

  @IsOptional()
  @IsUrl()
  zalo?: string;

  @IsOptional()
  @IsUrl()
  instagram?: string;
}
