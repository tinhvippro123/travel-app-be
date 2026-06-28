import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceCategory } from '@modules/place/entities';
import {
  CreatePlaceCategoryDto,
  UpdatePlaceCategoryDto,
} from '@modules/place/dto';
import {
  IPlaceCategoryRepository,
  IPlaceCategoryService,
} from '@modules/place/interfaces';

@Injectable()
export class PlaceCategoryService implements IPlaceCategoryService {
  constructor(private readonly categoryRepository: IPlaceCategoryRepository) {}

  async findAll(): Promise<PlaceCategory[]> {
    return this.categoryRepository.findAll();
  }

  async findById(id: string): Promise<PlaceCategory> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Place category with id "${id}" not found`);
    }
    return category;
  }

  async existsById(id: string): Promise<boolean> {
    return this.categoryRepository.existsById(id);
  }

  async findByIds(ids: string[]): Promise<PlaceCategory[]> {
    return this.categoryRepository.findByIds(ids);
  }

  async create(dto: CreatePlaceCategoryDto): Promise<PlaceCategory> {
    return this.categoryRepository.create(dto);
  }

  async update(
    id: string,
    dto: UpdatePlaceCategoryDto,
  ): Promise<PlaceCategory> {
    await this.assertExists(id);
    return this.categoryRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.assertExists(id);
    await this.categoryRepository.softDelete(id);
  }

  private async assertExists(id: string): Promise<void> {
    const exists = await this.existsById(id);
    if (!exists) {
      throw new NotFoundException(`Place category with id "${id}" not found`);
    }
  }
}
