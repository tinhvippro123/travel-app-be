import { IBaseRepository } from '@common/interfaces/base-repository.interface';
import { PlaceCategory } from '@modules/place/entities';

export abstract class IPlaceCategoryRepository extends IBaseRepository<PlaceCategory> {
  abstract existsById(id: string): Promise<boolean>;

  abstract findByIds(ids: string[]): Promise<PlaceCategory[]>;
}
