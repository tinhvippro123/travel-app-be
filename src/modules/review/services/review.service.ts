import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewImage } from '@modules/review/entities';
import { CreateReviewDto, UpdateReviewDto } from '@modules/review/dto';
import { IReviewService, IReviewRepository } from '@modules/review/interfaces';
import { PaginatedResultDto } from '@common/dto/pagination.dto.js';
import { CloudinaryService } from '@infrastructure/cloudinary/cloudinary.service.js';
import { Place } from '@modules/place/entities/place.entity.js';
import * as crypto from 'crypto';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createReviewWithImages(
    userId: string,
    createReviewDto: CreateReviewDto,
    files: Express.Multer.File[],
  ): Promise<Review> {
    const { placeId, comment } = createReviewDto;

    const place = await this.placeRepository.findOne({
      where: { id: placeId },
    });
    if (!place) throw new NotFoundException('Place not found');

    const uploadedImages: ReviewImage[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await this.cloudinaryService.uploadFile(
          file,
          'reviews',
        );
        uploadedImages.push({
          id: crypto.randomUUID(),
          fileName: file.originalname,
          mimeType: file.mimetype,
          url: uploadResult.secure_url,
        });
      }
    }

    const savedReview = await this.reviewRepository.create({
      userId,
      placeId,
      comment,
      images: uploadedImages,
    });

    const fullReview = await this.reviewRepository.findByIdWithUser(
      savedReview.id,
    );
    return fullReview || savedReview;
  }

  async findAllByPlace(
    placeId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResultDto<Review>> {
    const [items, total] = await this.reviewRepository.findAllByPlace(
      placeId,
      page,
      limit,
    );

    return new PaginatedResultDto(items, total, page, limit);
  }

  async updateReviewWithImages(
    id: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
    files?: Express.Multer.File[],
  ): Promise<Review> {
    const review = await this.reviewRepository.findOneBy({ id, userId });
    if (!review)
      throw new NotFoundException('Review not found or unauthorized');

    if (updateReviewDto.comment !== undefined) {
      review.comment = updateReviewDto.comment;
    }

    let currentImages = review.images || [];

    if (updateReviewDto.imagesToKeep) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const imagesToKeepIds: string[] = JSON.parse(
          updateReviewDto.imagesToKeep,
        );

        // Delete filtering
        currentImages = currentImages.filter((img) =>
          imagesToKeepIds.includes(img.id),
        );
      } catch {
        // ignore
      }
    }

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await this.cloudinaryService.uploadFile(
          file,
          'reviews',
        );
        currentImages.push({
          id: crypto.randomUUID(),
          fileName: file.originalname,
          mimeType: file.mimetype,
          url: uploadResult.secure_url,
        });
      }
    }

    review.images = currentImages;

    await this.reviewRepository.update(id, review);
    const fullReview = await this.reviewRepository.findByIdWithUser(id);
    return fullReview || review;
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.findAll();
  }

  async findById(id: string): Promise<Review> {
    const review = await this.reviewRepository.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_dto: CreateReviewDto): Promise<Review> {
    throw new Error('Use createReviewWithImages instead');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_id: string, _dto: UpdateReviewDto): Promise<Review> {
    throw new Error('Use updateReviewWithImages instead');
  }

  async delete(id: string): Promise<void> {
    await this.reviewRepository.softDelete(id);
  }
}
