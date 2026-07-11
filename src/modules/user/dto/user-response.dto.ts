import { Expose } from 'class-transformer';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  avatarUrl: string | null;

  @Expose()
  role: string;

  @Expose()
  status: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.avatarUrl = user.avatar || null;
    this.role = user.role?.name || 'Visitor';
    this.status = user.status;
  }
}
