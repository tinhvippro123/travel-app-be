import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponseDto } from '../dto/api-response.dto.js';

/**
 * Global interceptor — tự động wrap tất cả response
 * thành format { success, message, data, timestamp }.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data) => ApiResponseDto.ok(data)),
    );
  }
}
