import { IBaseRepository } from '@common/interfaces/base-repository.interface.js';
import { Place } from '@modules/place/entities';
import { PlaceStatus } from '@common/enums/index.js';

export abstract class IPlaceRepository extends IBaseRepository<Place> {
  abstract findByStatus(status: PlaceStatus): Promise<Place[]>;

  abstract findByLocation(location: string): Promise<Place[]>;

  abstract updateStatus(id: string, status: PlaceStatus): Promise<Place>;
}
