import { Role, CreateRoleDto, UpdateRoleDto } from '@modules/user';
import { IBaseService } from '@common/interfaces';

export abstract class IRoleService extends IBaseService<
  Role,
  CreateRoleDto,
  UpdateRoleDto
> {}
