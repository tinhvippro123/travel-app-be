import { Place, CreatePlaceDto, UpdatePlaceDto } from '@modules/place';
import { IBaseService } from '@common/interfaces';
import { PlaceStatus } from '@common/enums';
export abstract class IPlaceService extends IBaseService<
  Place,
  CreatePlaceDto,
  UpdatePlaceDto
> {
  abstract findByStatus(status: PlaceStatus): Promise<Place[]>;
  abstract findByDestination(destination: string): Promise<Place[]>;
}
