import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '@common/entities/base.entity.js';
import { Role } from './role.entity.js';
import { LocalAccount } from './local-account.entity.js';
import { Session } from '../../auth/entities/session.entity.js';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatar?: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToOne(() => LocalAccount, localAccount => localAccount.user)
  localAccount: LocalAccount;

  @OneToMany(() => Session, session => session.user)
  sessions: Session[];
}
