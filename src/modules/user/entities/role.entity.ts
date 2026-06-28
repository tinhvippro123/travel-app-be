import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@common/entities/base.entity.js';

@Entity('roles')
export class Role extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  key: string;
}