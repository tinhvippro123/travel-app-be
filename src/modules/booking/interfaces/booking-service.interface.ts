import { IBaseService } from '@common/interfaces/base-service.interface';
import { Booking } from '../entities/booking.entity';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';

export abstract class IBookingService extends IBaseService<
  Booking,
  CreateBookingDto,
  UpdateBookingDto
> {
  abstract findByUserId(userId: string): Promise<Booking[]>;

  abstract createForUser(
    userId: string,
    dto: CreateBookingDto,
  ): Promise<Booking>;
}
