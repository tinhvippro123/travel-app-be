import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UpdateProfileDto,
} from '@modules/user/index.js';
import { Place } from '@modules/place/entities/place.entity.js';
import { IBaseService } from '@common/interfaces/base-service.interface.js';

/** * Interface cho User Service. * Extends IBaseService (CRUD chung) và thêm method riêng cho User domain. */
export abstract class IUserService extends IBaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  abstract findByEmail(email: string): Promise<User>;
  abstract registerNewUser(
    dto: import('../../auth/dto/register.dto.js').RegisterDto,
  ): Promise<User>;

  abstract updateProfile(id: string, dto: UpdateProfileDto): Promise<User>;
  abstract toggleFavorite(
    userId: string,
    placeId: string,
  ): Promise<{ isFavorite: boolean }>;
  abstract getFavorites(userId: string): Promise<Place[]>;
}
