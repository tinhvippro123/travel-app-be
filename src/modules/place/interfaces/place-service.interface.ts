import { IBaseService } from '@common/interfaces/base-service.interface.js';
import { Place } from '@modules/place/entities';
import { CreatePlaceDto } from '@modules/place/dto';
import { UpdatePlaceDto } from '@modules/place/dto';
import { PlaceStatus } from '@common/enums/index.js';

export abstract class IPlaceService extends IBaseService<
  Place,
  CreatePlaceDto,
  UpdatePlaceDto
> {
  abstract findByStatus(status: PlaceStatus): Promise<Place[]>;

  abstract findByLocation(location: string): Promise<Place[]>;

  abstract updateStatus(id: string, status: PlaceStatus): Promise<Place>;
}
