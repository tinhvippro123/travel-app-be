import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, In, Repository } from 'typeorm';
import { Place, PlaceCategory } from '@modules/place/entities';
import { IPlaceRepository } from '@modules/place/interfaces';
import { PlaceStatus } from '@common/enums';

@Injectable()
export class PlaceRepository implements IPlaceRepository {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepo: Repository<Place>,
    @InjectRepository(PlaceCategory)
    private readonly categoryRepo: Repository<PlaceCategory>,
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
      .leftJoinAndSelect('place.categories', 'category')
      .where('LOWER(place.location) LIKE LOWER(:location)', {
        location: `%${location}%`,
      })
      .orWhere('LOWER(place.name) LIKE LOWER(:location)', {
        location: `%${location}%`,
      })
      .getMany();
  }

  async create(data: DeepPartial<Place>): Promise<Place> {
    const { categoryIds, ...placeData } = data as DeepPartial<Place> & {
      categoryIds?: string[];
    };
    const place = this.placeRepo.create(placeData);
    place.categories = await this.findCategories(categoryIds);
    const savedPlace = await this.placeRepo.save(place);
    return this.findById(savedPlace.id) as Promise<Place>;
  }

  async update(id: string, data: DeepPartial<Place>): Promise<Place> {
    const { categoryIds, ...placeData } = data as DeepPartial<Place> & {
      categoryIds?: string[];
    };
    const place = await this.findById(id);
    if (!place) {
      return this.findById(id) as Promise<Place>;
    }

    this.placeRepo.merge(place, placeData);
    if (categoryIds !== undefined) {
      place.categories = await this.findCategories(categoryIds);
    }

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

  private async findCategories(
    categoryIds?: string[],
  ): Promise<PlaceCategory[]> {
    if (!categoryIds?.length) {
      return [];
    }
    return this.categoryRepo.findBy({ id: In(categoryIds) });
  }
}
