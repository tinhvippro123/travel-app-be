import { IsOptional, IsString } from 'class-validator';

export class UpdatePlaceCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
