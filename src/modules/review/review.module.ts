import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from '@modules/review/controllers';
import { ReviewService } from '@modules/review/services';
import { ReviewRepository } from '@modules/review/repositories';
import { IReviewService, IReviewRepository } from '@modules/review/interfaces';
import { Review } from '@modules/review/entities';
import { Place } from '@modules/place/entities/place.entity.js';
import { CloudinaryModule } from '@infrastructure/cloudinary/cloudinary.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Place]), CloudinaryModule],
  controllers: [ReviewController],
  providers: [
    { provide: IReviewRepository, useClass: ReviewRepository },
    { provide: IReviewService, useClass: ReviewService },
  ],
  exports: [IReviewService],
})
export class ReviewModule {}
