import { IsOptional, IsString } from 'class-validator';

export class CreatePlaceCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
