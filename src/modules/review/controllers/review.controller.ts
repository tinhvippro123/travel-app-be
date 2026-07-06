import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IReviewService } from '@modules/review/interfaces';
import { CreateReviewDto, UpdateReviewDto } from '@modules/review/dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard.js';
import { User } from '@common/decorators/index.js';
import { PaginationDto } from '@common/dto/pagination.dto.js';
import { ApiResponseDto } from '@common/dto/api-response.dto.js';

@Controller()
export class ReviewController {
  constructor(
    @Inject(IReviewService)
    private readonly reviewService: IReviewService,
  ) {}

  // POST /reviews
  @UseGuards(JwtAuthGuard)
  @Post('reviews')
  @UseInterceptors(FilesInterceptor('images', 5)) // max 5 images
  async create(
    @User('id') userId: string,
    @Body() createReviewDto: CreateReviewDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const review = await this.reviewService.createReviewWithImages(
      userId,
      createReviewDto,
      files,
    );
    return ApiResponseDto.ok(review, 'Review created successfully');
  }

  // GET /places/:placeId/reviews
  @Get('places/:placeId/reviews')
  async findAllByPlace(
    @Param('placeId') placeId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const result = await this.reviewService.findAllByPlace(
      placeId,
      page,
      limit,
    );
    return ApiResponseDto.ok(result, 'Reviews fetched successfully');
  }

  // PATCH /reviews/:id
  @UseGuards(JwtAuthGuard)
  @Patch('reviews/:id')
  @UseInterceptors(FilesInterceptor('images', 5))
  async update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const review = await this.reviewService.updateReviewWithImages(
      id,
      userId,
      updateReviewDto,
      files,
    );
    return ApiResponseDto.ok(review, 'Review updated successfully');
  }
}
