import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity.js';
import { BookingController } from './controllers/booking.controller.js';
import { BookingRepository } from './repositories/booking.repository.js';
import { BookingService } from './services/booking.service.js';
import { IBookingRepository } from './interfaces/booking-repository.interface.js';
import { IBookingService } from './interfaces/booking-service.interface.js';
import { TourModule } from '../tour/tour.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    TourModule, // Import để dùng ITourService tính giá
  ],
  controllers: [BookingController],
  providers: [
    { provide: IBookingRepository, useClass: BookingRepository },
    { provide: IBookingService, useClass: BookingService },
  ],
  exports: [IBookingService],
})
export class BookingModule {}
