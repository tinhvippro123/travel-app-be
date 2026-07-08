import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@common/entities';

@Entity('roles')
export class Role extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  key: string;
}
