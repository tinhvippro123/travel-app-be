import { IBaseRepository } from '@common/interfaces/base-repository.interface.js';
import { Place } from '@modules/place/entities';
import { PlaceStatus } from '@common/enums/index.js';

export abstract class IPlaceRepository extends IBaseRepository<Place> {
  abstract findByStatus(status: PlaceStatus): Promise<Place[]>;

  abstract findByDestination(destination: string): Promise<Place[]>;
}
