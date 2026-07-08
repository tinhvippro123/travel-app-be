import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity.js';
import { BookingController } from '@modules/booking/controllers';
import { BookingRepository } from '@modules/booking/repositories';
import { BookingService } from '@modules/booking/services';
import { IBookingRepository } from './interfaces/booking-repository.interface.js';
import { IBookingService } from './interfaces/booking-service.interface.js';
import { PlaceModule } from '@modules/place';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    PlaceModule, // Import để dùng IPlaceService tính giá
  ],
  controllers: [BookingController],
  providers: [
    { provide: IBookingRepository, useClass: BookingRepository },
    { provide: IBookingService, useClass: BookingService },
  ],
  exports: [IBookingService],
})
export class BookingModule {}
