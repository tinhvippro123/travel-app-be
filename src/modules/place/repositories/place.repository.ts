import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { Place } from '../entities/place.entity.js';
import { IPlaceRepository } from '../interfaces/place-repository.interface.js';
import { PlaceStatus } from '@common/enums/index.js';

@Injectable()
export class PlaceRepository implements IPlaceRepository {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepo: Repository<Place>,
  ) {}

  async findAll(): Promise<Place[]> {
    return this.placeRepo.find();
  }

  async findById(id: string): Promise<Place | null> {
    return this.placeRepo.findOne({ where: { id } });
  }

  async findOneBy(where: FindOptionsWhere<Place>): Promise<Place | null> {
    return this.placeRepo.findOne({ where });
  }

  async findByStatus(status: PlaceStatus): Promise<Place[]> {
    return this.placeRepo.find({ where: { status } });
  }

  async findByDestination(destination: string): Promise<Place[]> {
    return this.placeRepo
      .createQueryBuilder('place')
      .where('LOWER(place.destination) LIKE LOWER(:destination)', {
        destination: `%${destination}%`,
      })
      .getMany();
  }

  async create(data: DeepPartial<Place>): Promise<Place> {
    const place = this.placeRepo.create(data);
    return this.placeRepo.save(place);
  }

  async update(id: string, data: DeepPartial<Place>): Promise<Place> {
    await this.placeRepo.update(id, data);
    return this.findById(id) as Promise<Place>;
  }

  async softDelete(id: string): Promise<void> {
    await this.placeRepo.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.placeRepo.delete(id);
  }
}
