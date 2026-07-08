import { Place } from '@modules/place';
import { IBaseRepository } from '@common/interfaces';
import { PlaceStatus } from '@common/enums';
export abstract class IPlaceRepository extends IBaseRepository<Place> {
  abstract findByStatus(status: PlaceStatus): Promise<Place[]>;
  abstract findByDestination(destination: string): Promise<Place[]>;
}
