import { IBaseService } from '@common/interfaces/base-service.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

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
}
