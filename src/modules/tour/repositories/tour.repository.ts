import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { Tour } from '../entities/tour.entity.js';
import { ITourRepository } from '../interfaces/tour-repository.interface.js';
import { TourStatus } from '../../../common/enums/index.js';

@Injectable()
export class TourRepository implements ITourRepository {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepo: Repository<Tour>,
  ) {}

  async findAll(): Promise<Tour[]> {
    return this.tourRepo.find();
  }

  async findById(id: string): Promise<Tour | null> {
    return this.tourRepo.findOne({ where: { id } });
  }

  async findOneBy(where: FindOptionsWhere<Tour>): Promise<Tour | null> {
    return this.tourRepo.findOne({ where });
  }

  async findByStatus(status: TourStatus): Promise<Tour[]> {
    return this.tourRepo.find({ where: { status } });
  }

  async findByDestination(destination: string): Promise<Tour[]> {
    return this.tourRepo
      .createQueryBuilder('tour')
      .where('LOWER(tour.destination) LIKE LOWER(:destination)', {
        destination: `%${destination}%`,
      })
      .getMany();
  }

  async create(data: DeepPartial<Tour>): Promise<Tour> {
    const tour = this.tourRepo.create(data);
    return this.tourRepo.save(tour);
  }

  async update(id: string, data: DeepPartial<Tour>): Promise<Tour> {
    await this.tourRepo.update(id, data);
    return this.findById(id) as Promise<Tour>;
  }

  async softDelete(id: string): Promise<void> {
    await this.tourRepo.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.tourRepo.delete(id);
  }
}
