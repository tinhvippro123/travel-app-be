import { Injectable, NotFoundException } from '@nestjs/common';
import { Place } from '@modules/place/entities';
import { CreatePlaceDto, UpdatePlaceDto } from '@modules/place/dto';
import {
  IPlaceCategoryService,
  IPlaceRepository,
  IPlaceService,
} from '@modules/place/interfaces';
import { PlaceStatus } from '@common/enums';

@Injectable()
export class PlaceService implements IPlaceService {
  constructor(
    private readonly placeRepository: IPlaceRepository,
    private readonly categoryService: IPlaceCategoryService,
  ) {}

  async findAll(): Promise<Place[]> {
    return this.placeRepository.findAll();
  }

  async findById(id: string): Promise<Place> {
    const place = await this.placeRepository.findById(id);
    if (!place) {
      throw new NotFoundException(`Place with id "${id}" not found`);
    }
    return place;
  }

  async existsById(id: string): Promise<boolean> {
    return this.placeRepository.existsById(id);
  }

  async findByStatus(status: PlaceStatus): Promise<Place[]> {
    return this.placeRepository.findByStatus(status);
  }

  async findByLocation(location: string): Promise<Place[]> {
    return this.placeRepository.findByLocation(location);
  }

  async create(dto: CreatePlaceDto): Promise<Place> {
    const { categoryIds, ...placeData } = dto;
    const categories = await this.categoryService.findByIds(categoryIds ?? []);

    return this.placeRepository.create({
      ...placeData,
      categories,
    });
  }

  async update(id: string, dto: UpdatePlaceDto): Promise<Place> {
    await this.assertExists(id);
    const { categoryIds, ...placeData } = dto;
    const data: Partial<Place> = { ...placeData };

    if (categoryIds !== undefined) {
      data.categories = await this.categoryService.findByIds(categoryIds);
    }

    return this.placeRepository.update(id, data);
  }

  async updateStatus(id: string, status: PlaceStatus): Promise<Place> {
    await this.assertExists(id);
    return this.placeRepository.updateStatus(id, status);
  }

  async delete(id: string): Promise<void> {
    await this.assertExists(id);
    await this.placeRepository.softDelete(id);
  }

  private async assertExists(id: string): Promise<void> {
    const exists = await this.existsById(id);
    if (!exists) {
      throw new NotFoundException(`Place with id "${id}" not found`);
    }
  }
}
