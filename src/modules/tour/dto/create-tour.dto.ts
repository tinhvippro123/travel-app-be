import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { TourStatus } from '@common/enums/index.js';

export class CreateTourDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @IsString()
  duration: string;

  @IsInt()
  @Min(1)
  maxParticipants: number;

  @IsString()
  destination: string;

  @IsString()
  departureLocation: string;

  @IsOptional()
  @IsEnum(TourStatus)
  status?: TourStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
