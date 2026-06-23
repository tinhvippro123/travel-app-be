import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/index.js';

export const ROLES_KEY = 'roles';

/**
 * @Roles(UserRole.ADMIN) — chỉ cho phép user có role cụ thể truy cập.
 * Dùng cùng RolesGuard.
 *
 * Ví dụ:
 * @Roles(UserRole.ADMIN)
 * @Delete(':id')
 * delete() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
