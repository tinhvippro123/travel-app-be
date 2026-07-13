import { Role } from '@modules/user/entities/role.entity';
import { IBaseRepository } from '@common/interfaces/base-repository.interface';

export abstract class IRoleRepository extends IBaseRepository<Role> {
  abstract findByKey(key: string): Promise<Role | null>;
  abstract findByName(name: string): Promise<Role | null>;
}
