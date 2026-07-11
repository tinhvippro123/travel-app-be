import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Place } from '@modules/place/entities';
import { IPlaceRepository } from '@modules/place/interfaces';
import { PlaceStatus } from '@common/enums';
import { PaginatedResultDto } from '@common/dto/pagination.dto';
import { PlaceQueryDto, PlaceSortOption } from '@modules/place/dto';

@Injectable()
export class PlaceRepository implements IPlaceRepository {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepo: Repository<Place>,
  ) {}

  async findAll(): Promise<Place[]> {
    return this.placeRepo.find({ relations: { categories: true } });
  }

  async findPaginated(
    query: PlaceQueryDto,
  ): Promise<PaginatedResultDto<Place>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const builder = this.placeRepo
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.categories', 'category');

    if (query.categoryIds?.length) {
      builder
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('mapping.place_id')
            .from('place_category_mappings', 'mapping')
            .where('mapping.category_id IN (:...categoryIds)')
            .groupBy('mapping.place_id')
            .having('COUNT(DISTINCT mapping.category_id) = :categoryCount')
            .getQuery();

          return `place.id IN ${subQuery}`;
        })
        .setParameters({
          categoryIds: query.categoryIds,
          categoryCount: query.categoryIds.length,
        });
    }

    switch (query.sort ?? PlaceSortOption.DEFAULT) {
      case PlaceSortOption.NAME_ASC:
        builder.orderBy('place.name', 'ASC');
        break;
      case PlaceSortOption.NAME_DESC:
        builder.orderBy('place.name', 'DESC');
        break;
      case PlaceSortOption.UPDATED_NEWEST:
        builder.orderBy('place.updatedAt', 'DESC');
        break;
      case PlaceSortOption.DEFAULT:
        builder.orderBy('place.createdAt', 'DESC');
        break;
    }

    const [places, total] = await builder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginatedResultDto(places, total, page, limit);
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
