import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '@common/enums';

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
