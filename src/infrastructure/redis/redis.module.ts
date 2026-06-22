import { Module } from '@nestjs/common';

/**
 * Redis module — placeholder cho cache service.
 * Khi cần dùng Redis, cài thêm:
 *   npm install @nestjs/cache-manager cache-manager cache-manager-ioredis-yet ioredis
 * rồi config CacheModule.registerAsync ở đây.
 */
@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class RedisModule {}
