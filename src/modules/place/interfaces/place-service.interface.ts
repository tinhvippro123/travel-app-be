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

  abstract findByDestination(destination: string): Promise<Place[]>;
}
