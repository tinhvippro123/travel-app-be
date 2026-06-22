import { Injectable, NotFoundException } from '@nestjs/common';
import { Booking } from '../entities/booking.entity.js';
import { CreateBookingDto } from '../dto/create-booking.dto.js';
import { UpdateBookingDto } from '../dto/update-booking.dto.js';
import { IBookingService } from '../interfaces/booking-service.interface.js';
import { IBookingRepository } from '../interfaces/booking-repository.interface.js';
import { ITourService } from '../../tour/interfaces/tour-service.interface.js';

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly tourService: ITourService,
  ) {}

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findByIdWithRelations(id);
    if (!booking) {
      throw new NotFoundException(`Booking with id "${id}" not found`);
    }
    return booking;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return this.bookingRepository.findByUserId(userId);
  }

  /**
   * Tạo booking cho user (userId lấy từ JWT token).
   * Tự động tính totalPrice = tour.price * numberOfParticipants.
   */
  async createForUser(userId: string, dto: CreateBookingDto): Promise<Booking> {
    const tour = await this.tourService.findById(dto.tourId);

    const price = tour.discountPrice ?? tour.price;
    const totalPrice = Number(price) * dto.numberOfParticipants;

    return this.bookingRepository.create({
      ...dto,
      userId,
      totalPrice,
    });
  }

  async create(dto: CreateBookingDto): Promise<Booking> {
    return this.bookingRepository.create(dto);
  }

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    await this.findById(id);
    return this.bookingRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.bookingRepository.softDelete(id);
  }
}
