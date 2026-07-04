import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, In, Repository } from 'typeorm';
import { PlaceCategory } from '@modules/place/entities';
import { IPlaceCategoryRepository } from '@modules/place/interfaces';
import { PaginatedResultDto, PaginationDto } from '@common/dto';

@Injectable()
export class PlaceCategoryRepository implements IPlaceCategoryRepository {
  constructor(
    @InjectRepository(PlaceCategory)
    private readonly categoryRepo: Repository<PlaceCategory>,
  ) {}

  async findAll(): Promise<PlaceCategory[]> {
    return this.categoryRepo.find();
  }

  async findPaginated(
    pagination: PaginationDto,
  ): Promise<PaginatedResultDto<PlaceCategory>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const [categories, total] = await this.categoryRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return new PaginatedResultDto(categories, total, page, limit);
  }

  async findById(id: string): Promise<PlaceCategory | null> {
    return this.categoryRepo.findOne({ where: { id } });
  }

  async existsById(id: string): Promise<boolean> {
    return this.categoryRepo.exists({ where: { id } });
  }

  async findByIds(ids: string[]): Promise<PlaceCategory[]> {
    if (!ids.length) {
      return [];
    }
    return this.categoryRepo.findBy({ id: In(ids) });
  }

  async findOneBy(
    where: FindOptionsWhere<PlaceCategory>,
  ): Promise<PlaceCategory | null> {
    return this.categoryRepo.findOne({ where });
  }

  async create(data: DeepPartial<PlaceCategory>): Promise<PlaceCategory> {
    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }

  async update(
    id: string,
    data: DeepPartial<PlaceCategory>,
  ): Promise<PlaceCategory> {
    await this.categoryRepo.update(id, data);
    return this.findById(id) as Promise<PlaceCategory>;
  }

  async softDelete(id: string): Promise<void> {
    await this.categoryRepo.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.categoryRepo.delete(id);
  }
}
