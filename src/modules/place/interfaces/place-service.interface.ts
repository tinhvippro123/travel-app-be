import { IBaseService } from '@common/interfaces/base-service.interface';
import { PaginatedResultDto } from '@common/dto/pagination.dto';
import { Place } from '@modules/place/entities';
import { CreatePlaceDto, PlaceQueryDto } from '@modules/place/dto';
import { UpdatePlaceDto } from '@modules/place/dto';
import { PlaceStatus } from '@common/enums/index';

export abstract class IPlaceService extends IBaseService<
  Place,
  CreatePlaceDto,
  UpdatePlaceDto
> {
  abstract findPaginated(
    query: PlaceQueryDto,
  ): Promise<PaginatedResultDto<Place>>;

  abstract existsById(id: string): Promise<boolean>;

  abstract findByStatus(status: PlaceStatus): Promise<Place[]>;

  abstract findByLocation(location: string): Promise<Place[]>;

  abstract updateStatus(id: string, status: PlaceStatus): Promise<Place>;
}
