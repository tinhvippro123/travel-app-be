import { User } from '@modules/user';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@common/entities';

@Entity('sessions')
export class Session extends AbstractEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'token_hash' })
  tokenHash: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'revoked_at', nullable: true })
  revokedAt?: Date;
}
