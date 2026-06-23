import { IBaseService } from '@common/interfaces/base-service.interface.js';
import { Tour } from '../entities/tour.entity.js';
import { CreateTourDto } from '../dto/create-tour.dto.js';
import { UpdateTourDto } from '../dto/update-tour.dto.js';
import { TourStatus } from '@common/enums/index.js';

/**
 * Interface cho Tour Service.
 */
export abstract class ITourService extends IBaseService<
  Tour,
  CreateTourDto,
  UpdateTourDto
> {
  abstract findByStatus(status: TourStatus): Promise<Tour[]>;

  abstract findByDestination(destination: string): Promise<Tour[]>;
}
