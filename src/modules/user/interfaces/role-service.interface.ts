import { Role, CreateRoleDto, UpdateRoleDto } from '@modules/user';
import { IBaseService } from '@common/interfaces/base-service.interface.js';

export abstract class IRoleService extends IBaseService<
  Role,
  CreateRoleDto,
  UpdateRoleDto
> {}
