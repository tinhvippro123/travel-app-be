import { IBaseRepository } from '@common/interfaces/base-repository.interface.js';
import { Tour } from '../entities/tour.entity.js';
import { TourStatus } from '@common/enums/index.js';

/**
 * Interface cho Tour Repository.
 * Extends base CRUD + thêm method riêng cho Tour domain.
 */
export abstract class ITourRepository extends IBaseRepository<Tour> {
  abstract findByStatus(status: TourStatus): Promise<Tour[]>;

  abstract findByDestination(destination: string): Promise<Tour[]>;
}
