import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { IOtpRepository } from '../interfaces/otp.repository.interface.js';
import { Otp, OtpType } from '../entities/otp.entity.js';

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(
    @InjectRepository(Otp)
    private readonly repo: Repository<Otp>,
  ) {}

  async saveOtp(target: string, code: string, expiresAt: Date, type: OtpType): Promise<Otp> {
    const otp = this.repo.create({
      target,
      code,
      expiresAt,
      type,
      isUsed: false,
      attempts: 0,
    });
    return this.repo.save(otp);
  }

  async findLatestValidOtp(target: string, type: OtpType): Promise<Otp | null> {
    return this.repo.findOne({
      where: {
        target,
        type,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.repo.update(id, { isUsed: true });
  }

  async incrementAttempts(id: string): Promise<void> {
    await this.repo.increment({ id }, 'attempts', 1);
  }

  async invalidatePreviousOtps(target: string, type: OtpType): Promise<void> {
    await this.repo.update(
      {
        target,
        type,
        isUsed: false,
      },
      {
        isUsed: true,
      },
    );
  }

  async deleteExpired(): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .delete()
      .from(Otp)
      .where('expires_at < :now OR is_used = :isUsed', {
        now: new Date(),
        isUsed: true,
      })
      .execute();
  }
}
