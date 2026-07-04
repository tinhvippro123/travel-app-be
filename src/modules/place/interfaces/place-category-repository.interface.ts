import { IBaseRepository } from '@common/interfaces/base-repository.interface';
import { PaginatedResultDto, PaginationDto } from '@common/dto';
import { PlaceCategory } from '@modules/place/entities';

export abstract class IPlaceCategoryRepository extends IBaseRepository<PlaceCategory> {
  abstract findPaginated(
    pagination: PaginationDto,
  ): Promise<PaginatedResultDto<PlaceCategory>>;

  abstract existsById(id: string): Promise<boolean>;

  abstract findByIds(ids: string[]): Promise<PlaceCategory[]>;
}
