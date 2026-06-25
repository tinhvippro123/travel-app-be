import { IBaseService } from '@common/interfaces/base-service.interface.js';
import { Place } from '../entities/place.entity.js';
import { CreatePlaceDto } from '../dto/create-place.dto.js';
import { UpdatePlaceDto } from '../dto/update-place.dto.js';
import { PlaceStatus } from '@common/enums/index.js';

export abstract class IPlaceService extends IBaseService<
  Place,
  CreatePlaceDto,
  UpdatePlaceDto
> {
  abstract findByStatus(status: PlaceStatus): Promise<Place[]>;

  abstract findByDestination(destination: string): Promise<Place[]>;
}
