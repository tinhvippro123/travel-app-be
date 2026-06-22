import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { Booking } from '../entities/booking.entity.js';
import { IBookingRepository } from '../interfaces/booking-repository.interface.js';

@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async findAll(): Promise<Booking[]> {
    return this.bookingRepo.find({ relations: { user: true, tour: true } });
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookingRepo.findOne({ where: { id } });
  }

  async findByIdWithRelations(id: string): Promise<Booking | null> {
    return this.bookingRepo.findOne({
      where: { id },
      relations: { user: true, tour: true },
    });
  }

  async findOneBy(where: FindOptionsWhere<Booking>): Promise<Booking | null> {
    return this.bookingRepo.findOne({ where });
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { userId },
      relations: { tour: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByTourId(tourId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { tourId },
      relations: { user: true },
    });
  }

  async create(data: DeepPartial<Booking>): Promise<Booking> {
    const booking = this.bookingRepo.create(data);
    return this.bookingRepo.save(booking);
  }

  async update(id: string, data: DeepPartial<Booking>): Promise<Booking> {
    await this.bookingRepo.update(id, data);
    return this.findByIdWithRelations(id) as Promise<Booking>;
  }

  async softDelete(id: string): Promise<void> {
    await this.bookingRepo.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.bookingRepo.delete(id);
  }
}
