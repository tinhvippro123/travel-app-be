import { IBaseService } from '@common/interfaces/base-service.interface.js';
import { Review } from '@modules/review/entities';
import { CreateReviewDto, UpdateReviewDto } from '@modules/review/dto';
import { PaginatedResultDto } from '@common/dto/pagination.dto.js';

export abstract class IReviewService extends IBaseService<
  Review,
  CreateReviewDto,
  UpdateReviewDto
> {
  abstract createReviewWithImages(
    userId: string,
    createReviewDto: CreateReviewDto,
    files: Express.Multer.File[],
  ): Promise<Review>;

  abstract findAllByPlace(
    placeId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResultDto<Review>>;

  abstract updateReviewWithImages(
    id: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
    files?: Express.Multer.File[],
  ): Promise<Review>;
}
