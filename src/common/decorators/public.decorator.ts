import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public() — đánh dấu route là public, không cần authentication.
 * Dùng trước @Get(), @Post() etc.
 *
 * Ví dụ:
 * @Public()
 * @Get('places')
 * findAll() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
