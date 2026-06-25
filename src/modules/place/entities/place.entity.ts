import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@common/entities/base.entity.js';
import { PlaceStatus } from '@common/enums/index.js';

@Entity('places')
export class Place extends AbstractEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    name: 'discount_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountPrice?: number;

  @Column()
  duration: string; // vd: "3 ngày 2 đêm"

  @Column({ name: 'max_participants' })
  maxParticipants: number;

  @Column()
  destination: string;

  @Column({ name: 'departure_location' })
  departureLocation: string;

  @Column({ name: 'cover_image', nullable: true })
  coverImage?: string;

  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column({ type: 'enum', enum: PlaceStatus, default: PlaceStatus.DRAFT })
  status: PlaceStatus;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate?: Date;
}
