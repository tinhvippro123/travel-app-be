import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from './user.entity.js';

@Entity('local_accounts')
export class LocalAccount {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}