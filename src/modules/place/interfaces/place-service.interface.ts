import { Place } from '@modules/place/index.js';
import { CreatePlaceDto, UpdatePlaceDto } from '@modules/place/index.js';
import { IBaseService } from '@common/interfaces/base-service.interface.js';
import { PlaceStatus } from '@common/enums/index.js';
export abstract class IPlaceService extends IBaseService<
  Place,
  CreatePlaceDto,
  UpdatePlaceDto
> {
  abstract findByStatus(status: PlaceStatus): Promise<Place[]>;
  abstract findByDestination(destination: string): Promise<Place[]>;
}
