import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { firstValueFrom, of, throwError } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor.js';

describe('TransformInterceptor', () => {
  it('wraps response data without losing its fields', async () => {
    const data = { id: 'user-1', email: 'test@example.com' };
    const interceptor = new TransformInterceptor<typeof data>();
    const response = await firstValueFrom(
      interceptor.intercept(new ExecutionContextHost([]), {
        handle: () => of(data),
      }),
    );
    expect(response).toMatchObject({ success: true, message: 'Success', data });
    expect(Number.isNaN(Date.parse(response.timestamp))).toBe(false);
  });

  it('propagates service errors instead of wrapping them as successes', async () => {
    const error = new Error('Service failed');
    const interceptor = new TransformInterceptor<unknown>();
    const result = interceptor.intercept(new ExecutionContextHost([]), {
      handle: () => throwError(() => error),
    });
    await expect(firstValueFrom(result)).rejects.toBe(error);
  });
});
