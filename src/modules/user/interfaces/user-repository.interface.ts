import { IBaseRepository } from '@common/interfaces/base-repository.interface.js';
import { User } from '../entities/user.entity.js';

/**
 * Interface cho User Repository.
 * Extends IBaseRepository (CRUD chung) và thêm method riêng cho User domain.
 */
export abstract class IUserRepository extends IBaseRepository<User> {
  abstract findByEmail(email: string): Promise<User | null>;
}
