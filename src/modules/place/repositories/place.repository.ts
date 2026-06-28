import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Place } from '@modules/place/entities';
import { IPlaceRepository } from '@modules/place/interfaces';
import { PlaceStatus } from '@common/enums';

@Injectable()
export class PlaceRepository implements IPlaceRepository {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepo: Repository<Place>,
  ) {}

  async findAll(): Promise<Place[]> {
    return this.placeRepo.find({ relations: { categories: true } });
  }

  async findById(id: string): Promise<Place | null> {
    return this.placeRepo.findOne({
      where: { id },
      relations: { categories: true },
    });
  }

  async existsById(id: string): Promise<boolean> {
    return this.placeRepo.exists({ where: { id } });
  }

  async findOneBy(where: FindOptionsWhere<Place>): Promise<Place | null> {
    return this.placeRepo.findOne({ where, relations: { categories: true } });
  }

  async findByStatus(status: PlaceStatus): Promise<Place[]> {
    return this.placeRepo.find({
      where: { status },
      relations: { categories: true },
    });
  }

  async findByLocation(location: string): Promise<Place[]> {
    return this.placeRepo
      .createQueryBuilder('place')
      .innerJoinAndSelect('place.categories', 'category')
      .where('LOWER(place.location) LIKE LOWER(:location)', {
        location: `%${location}%`,
      })
      .getMany();
  }

  async create(data: DeepPartial<Place>): Promise<Place> {
    const place = this.placeRepo.create(data);
    const savedPlace = await this.placeRepo.save(place);
    return this.findById(savedPlace.id) as Promise<Place>;
  }

  async update(id: string, data: DeepPartial<Place>): Promise<Place> {
    const place = (await this.findById(id)) as Place;

    this.placeRepo.merge(place, data);
    await this.placeRepo.save(place);
    return this.findById(id) as Promise<Place>;
  }

  async updateStatus(id: string, status: PlaceStatus): Promise<Place> {
    await this.placeRepo.update(id, { status });
    return this.findById(id) as Promise<Place>;
  }

  async softDelete(id: string): Promise<void> {
    await this.placeRepo.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.placeRepo.delete(id);
  }
}
