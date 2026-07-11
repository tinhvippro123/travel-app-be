import { IsString, IsOptional } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  comment?: string;

  @IsOptional()
  @IsString()
  imagesToKeep?: string;
}
