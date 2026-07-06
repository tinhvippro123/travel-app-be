import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  placeId: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
