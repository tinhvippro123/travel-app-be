import { IBaseRepository } from '@common/interfaces/base-repository.interface';
import { PaginatedResultDto } from '@common/dto/pagination.dto';
import { PlaceQueryDto } from '@modules/place/dto';
import { Place } from '@modules/place/entities';
import { PlaceStatus } from '@common/enums/index';

export abstract class IPlaceRepository extends IBaseRepository<Place> {
  abstract findPaginated(
    query: PlaceQueryDto,
  ): Promise<PaginatedResultDto<Place>>;

  abstract existsById(id: string): Promise<boolean>;

  abstract findByStatus(status: PlaceStatus): Promise<Place[]>;

  abstract findByLocation(location: string): Promise<Place[]>;

  abstract updateStatus(id: string, status: PlaceStatus): Promise<Place>;
}
