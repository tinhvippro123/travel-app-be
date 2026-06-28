import { IBaseService } from '@common/interfaces/base-service.interface';
import { PlaceCategory } from '@modules/place/entities';
import {
  CreatePlaceCategoryDto,
  UpdatePlaceCategoryDto,
} from '@modules/place/dto';

export abstract class IPlaceCategoryService extends IBaseService<
  PlaceCategory,
  CreatePlaceCategoryDto,
  UpdatePlaceCategoryDto
> {
  abstract existsById(id: string): Promise<boolean>;

  abstract findByIds(ids: string[]): Promise<PlaceCategory[]>;
}
