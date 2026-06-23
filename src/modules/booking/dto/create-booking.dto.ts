import {
  IsString,
  IsUUID,
  IsInt,
  IsOptional,
  IsEmail,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  tourId: string;

  @IsInt()
  @Min(1)
  numberOfParticipants: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsString()
  contactPhone: string;

  @IsEmail()
  contactEmail: string;
}
