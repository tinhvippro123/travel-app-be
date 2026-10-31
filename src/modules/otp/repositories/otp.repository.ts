import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { IOtpRepository } from '../interfaces/otp.repository.interface.js';
import { Otp, OtpType } from '../entities/otp.entity.js';
import { REDIS_CLIENT } from '../../../infrastructure/redis/redis.provider.js';

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private getKey(target: string, type: OtpType): string {
    return `otp:${type}:${target}`;
  }

  async saveOtp(
    target: string,
    code: string,
    type: OtpType,
    ttl: number,
  ): Promise<void> {
    const key = this.getKey(target, type);
    await this.redis.hset(key, {
      code,
      type,
    });
    await this.redis.expire(key, ttl);
  }

  async findOtp(target: string, type: OtpType): Promise<Otp | null> {
    const key = this.getKey(target, type);
    const data = await this.redis.hgetall(key);

    if (!data || !data.code) {
      return null;
    }

    return new Otp({
      code: data.code,
      type: data.type as OtpType,
    });
  }

  async deleteOtp(target: string, type: OtpType): Promise<void> {
    const key = this.getKey(target, type);
    await this.redis.del(key);
  }
}
