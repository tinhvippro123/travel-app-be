import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Global prefix cho tất cả API: /api/v1/...
  app.setGlobalPrefix('api/v1');

  // Global validation pipe — tự động validate DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Loại bỏ field không có trong DTO
      forbidNonWhitelisted: true, // Throw nếu gửi field không hợp lệ
      transform: true,           // Tự động transform type (string → number, etc.)
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
}

bootstrap();
