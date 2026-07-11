import { IBaseRepository } from '@common/interfaces/base-repository.interface.js';
import { Review } from '@modules/review/entities';

export abstract class IReviewRepository extends IBaseRepository<Review> {
  abstract findAllByPlace(
    placeId: string,
    page: number,
    limit: number,
  ): Promise<[Review[], number]>;
  abstract findByIdWithUser(id: string): Promise<Review | null>;
}
