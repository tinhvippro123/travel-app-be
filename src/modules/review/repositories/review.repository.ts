import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { Review } from '@modules/review/entities';
import { IReviewRepository } from '@modules/review/interfaces';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async findAllByPlace(
    placeId: string,
    page: number,
    limit: number,
  ): Promise<[Review[], number]> {
    return this.reviewRepo.findAndCount({
      where: { placeId },
      relations: { user: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepo.find();
  }

  async findById(id: string): Promise<Review | null> {
    return this.reviewRepo.findOne({ where: { id } });
  }

  async findByIdWithUser(id: string): Promise<Review | null> {
    return this.reviewRepo.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async findOneBy(where: FindOptionsWhere<Review>): Promise<Review | null> {
    return this.reviewRepo.findOne({ where });
  }

  async create(data: DeepPartial<Review>): Promise<Review> {
    const review = this.reviewRepo.create(data);
    return this.reviewRepo.save(review);
  }

  async update(id: string, data: DeepPartial<Review>): Promise<Review> {
    await this.reviewRepo.update(id, data);
    return this.findById(id) as Promise<Review>;
  }

  async softDelete(id: string): Promise<void> {
    await this.reviewRepo.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.reviewRepo.delete(id);
  }
}
