import { Entity, Column, Index } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/base.entity.js';

export enum OtpType {
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot_password',
  LOGIN = 'login',
}

@Entity('otps')
@Index(['target', 'type', 'isUsed'])
export class Otp extends AbstractEntity {
  @Column()
  target: string;

  @Column({ length: 10 })
  code: string;

  @Column({ type: 'enum', enum: OtpType, default: OtpType.REGISTER })
  type: OtpType;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @Column({ default: 0 })
  attempts: number;
}
