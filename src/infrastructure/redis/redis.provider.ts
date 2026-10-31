import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const host = configService.get<string>('REDIS_HOST', 'localhost');
    const port = configService.get<number>('REDIS_PORT', 6379);
    const password = configService.get<string>('REDIS_PASSWORD');

    const redis = new Redis({
      host,
      port,
      password: password || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        return Math.min(times * 100, 2000);
      },
    });

    redis.on('error', (err) => {
      // Ghi log cảnh báo để tránh crash application nếu Redis chưa khởi động
      console.warn(`[RedisProvider] Connection issue: ${err.message}`);
    });

    return redis;
  },
};
