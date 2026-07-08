import { Role } from '@modules/user/entities';
import { IBaseRepository } from '@common/interfaces';

export abstract class IRoleRepository extends IBaseRepository<Role> {
  abstract findByKey(key: string): Promise<Role | null>;
  abstract findByName(name: string): Promise<Role | null>;
}
