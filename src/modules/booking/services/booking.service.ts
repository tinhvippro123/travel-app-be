import { Injectable, NotFoundException } from '@nestjs/common';
import { Booking } from '../entities/booking.entity.js';
import { CreateBookingDto } from '../dto/create-booking.dto.js';
import { UpdateBookingDto } from '../dto/update-booking.dto.js';
import { IBookingService } from '../interfaces/booking-service.interface.js';
import { IBookingRepository } from '../interfaces/booking-repository.interface.js';
import { IPlaceService } from '../../place/interfaces/place-service.interface.js';

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly placeService: IPlaceService,
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

  async createForUser(userId: string, dto: CreateBookingDto): Promise<Booking> {
    // 1. Kiểm tra Place tồn tại không
    await this.placeService.findById(dto.placeId);

    // 2. Tính giá tiền
    const totalPrice = 0;

    // 3. Tạo booking
    return this.bookingRepository.create({
      userId,
      placeId: dto.placeId,
      numberOfParticipants: dto.numberOfParticipants,
      totalPrice,
      contactPhone: dto.contactPhone,
      contactEmail: dto.contactEmail,
      note: dto.note,
    });
  }

  // Admin / Staff create
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  create(_dto: CreateBookingDto): Promise<Booking> {
    throw new Error('Method not implemented. Use createForUser instead.');
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
