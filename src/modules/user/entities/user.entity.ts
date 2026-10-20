import { Entity, Column, Index } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/base.entity.js';
import { UserRole, AccountStatus } from '../../../common/enums/index.js';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ name: 'token_version', default: 0 })
  tokenVersion: number;

  @Column({ name: 'account_status', enum: AccountStatus, default: AccountStatus.ACTIVE })
  accountStatus: AccountStatus;
}
