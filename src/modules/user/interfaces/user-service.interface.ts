import { IBaseService } from '@common/interfaces/base-service.interface.js';
import { User } from '../entities/user.entity.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';

/**
 * Interface cho User Service.
 * Extends IBaseService (CRUD chung) và thêm method riêng cho User domain.
 */
export abstract class IUserService extends IBaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  abstract findByEmail(email: string): Promise<User>;
  abstract registerNewUser(dto: import('../../auth/dto/register.dto.js').RegisterDto): Promise<User>;
}
