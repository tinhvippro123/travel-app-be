import { Place } from '@modules/place/index.js';
import { CreatePlaceDto, UpdatePlaceDto } from '@modules/place/index.js';
import { IPlaceService, IPlaceRepository } from '@modules/place/index.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceStatus } from '@common/enums/index.js';
@Injectable()
export class PlaceService implements IPlaceService {
  constructor(private readonly placeRepository: IPlaceRepository) {}
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
  async findByStatus(status: PlaceStatus): Promise<Place[]> {
    return this.placeRepository.findByStatus(status);
  }
  async findByDestination(destination: string): Promise<Place[]> {
    return this.placeRepository.findByDestination(destination);
  }
  async create(dto: CreatePlaceDto): Promise<Place> {
    return this.placeRepository.create(dto);
  }
  async update(id: string, dto: UpdatePlaceDto): Promise<Place> {
    await this.findById(id);
    return this.placeRepository.update(id, dto);
  }
  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.placeRepository.softDelete(id);
  }
}
