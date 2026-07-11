import { Role, CreateRoleDto, UpdateRoleDto } from '@modules/user/index';
import { IBaseService } from '@common/interfaces/base-service.interface';

export abstract class IRoleService extends IBaseService<
  Role,
  CreateRoleDto,
  UpdateRoleDto
> {}
