import { Expose } from 'class-transformer';
import { Role } from '../entities/role.entity.js';

export class RoleResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  key: string;

  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
    this.key = role.key;
  }
}
