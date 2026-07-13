import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@common/entities/base.entity';

@Entity('contacts')
export class Contact extends AbstractEntity {
  @Column({ name: 'company_name', nullable: true })
  companyName: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  zalo: string;

  @Column({ nullable: true })
  instagram: string;
}
