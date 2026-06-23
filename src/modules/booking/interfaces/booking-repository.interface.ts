import { IBaseRepository } from '@common/interfaces/base-repository.interface.js';
import { Booking } from '../entities/booking.entity.js';

export abstract class IBookingRepository extends IBaseRepository<Booking> {
  abstract findByUserId(userId: string): Promise<Booking[]>;

  abstract findByTourId(tourId: string): Promise<Booking[]>;

  abstract findByIdWithRelations(id: string): Promise<Booking | null>;
}
