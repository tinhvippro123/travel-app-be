import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@common/entities/base.entity';
import { BookingStatus } from '@common/enums/index';
import { User } from '@modules/user/entities/user.entity';
import { Place } from '@modules/place/entities/place.entity';

@Entity('bookings')
export class Booking extends AbstractEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Place)
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column({ name: 'place_id' })
  placeId: string;

  @Column({ name: 'number_of_participants' })
  numberOfParticipants: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ nullable: true })
  note?: string;

  @Column({ name: 'contact_phone' })
  contactPhone: string;

  @Column({ name: 'contact_email' })
  contactEmail: string;
}
