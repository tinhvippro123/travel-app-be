import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingController } from './controllers/booking.controller';
import { BookingRepository } from './repositories/booking.repository';
import { BookingService } from './services/booking.service';
import { IBookingRepository } from './interfaces/booking-repository.interface';
import { IBookingService } from './interfaces/booking-service.interface';
import { PlaceModule } from '../place/place.module';

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
