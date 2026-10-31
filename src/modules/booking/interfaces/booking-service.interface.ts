import { IBaseService } from '../../../common/interfaces/base-service.interface.js';
import { Booking } from '../entities/booking.entity.js';
import { CreateBookingDto } from '../dto/create-booking.dto.js';
import { UpdateBookingDto } from '../dto/update-booking.dto.js';

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
