import { Role, LocalAccount } from '@modules/user';
import { Session } from '@modules/auth';
import { Place } from '@modules/place/entities';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { AbstractEntity } from '@common/entities';

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

  @OneToOne(() => LocalAccount, (localAccount) => localAccount.user)
  localAccount: LocalAccount;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @ManyToMany(() => Place, (place) => place.favoritedBy)
  @JoinTable({
    name: 'favorite_places',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'place_id', referencedColumnName: 'id' },
  })
  favoritePlaces: Place[];
}
