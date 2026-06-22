import { Injectable, NotFoundException } from '@nestjs/common';
import { Tour } from '../entities/tour.entity.js';
import { CreateTourDto } from '../dto/create-tour.dto.js';
import { UpdateTourDto } from '../dto/update-tour.dto.js';
import { ITourService } from '../interfaces/tour-service.interface.js';
import { ITourRepository } from '../interfaces/tour-repository.interface.js';
import { TourStatus } from '../../../common/enums/index.js';

@Injectable()
export class TourService implements ITourService {
  constructor(private readonly tourRepository: ITourRepository) {}

  async findAll(): Promise<Tour[]> {
    return this.tourRepository.findAll();
  }

  async findById(id: string): Promise<Tour> {
    const tour = await this.tourRepository.findById(id);
    if (!tour) {
      throw new NotFoundException(`Tour with id "${id}" not found`);
    }
    return tour;
  }

  async findByStatus(status: TourStatus): Promise<Tour[]> {
    return this.tourRepository.findByStatus(status);
  }

  async findByDestination(destination: string): Promise<Tour[]> {
    return this.tourRepository.findByDestination(destination);
  }

  async create(dto: CreateTourDto): Promise<Tour> {
    return this.tourRepository.create(dto);
  }

  async update(id: string, dto: UpdateTourDto): Promise<Tour> {
    await this.findById(id);
    return this.tourRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.tourRepository.softDelete(id);
  }
}
